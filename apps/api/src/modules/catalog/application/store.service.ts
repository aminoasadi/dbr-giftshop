import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category, Collection, InventoryTransaction, Mission, Product } from '../infrastructure/catalog.entity';
import { User } from '../../users/infrastructure/user.entity';
import { Order } from '../../orders/infrastructure/order.entity';
import { RedeemCode } from '../../redeem-codes/infrastructure/redeem-code.entity';
import { BonusDto, CheckoutDto, MissionDto, ProductDto, RedeemCreateDto } from './store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Product) private products: Repository<Product>,
    @InjectRepository(Category) private categories: Repository<Category>,
    @InjectRepository(Collection) private collections: Repository<Collection>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(RedeemCode) private codes: Repository<RedeemCode>,
    @InjectRepository(InventoryTransaction) private inventory: Repository<InventoryTransaction>,
    @InjectRepository(Mission) private missions: Repository<Mission>,
  ) {}

  async catalog(q: Record<string, string>) {
    const qb = this.products.createQueryBuilder('p').leftJoinAndSelect('p.category', 'category').leftJoinAndSelect('p.collection', 'collection').leftJoinAndSelect('p.variants', 'variants').where("p.status = 'active'");
    if (q.category) qb.andWhere('category.slug=:category', { category: q.category });
    if (q.collection) qb.andWhere('collection.slug=:collection', { collection: q.collection });
    if (q.inStock === 'true') qb.andWhere('p.stock > 0');
    if (q.giftSuitable === 'true') qb.andWhere('p.giftSuitable=true');
    if (q.color) qb.andWhere('p.color=:color', { color: q.color });
    if (q.minPrice) qb.andWhere('COALESCE(p.salePrice,p.price)>=:min', { min: +q.minPrice });
    if (q.maxPrice) qb.andWhere('COALESCE(p.salePrice,p.price)<=:max', { max: +q.maxPrice });
    const sort = q.sort === 'cheapest' ? 'COALESCE(p.salePrice,p.price) ASC' : q.sort === 'expensive' ? 'COALESCE(p.salePrice,p.price) DESC' : 'p.id DESC';
    qb.orderBy(sort);
    const page = Math.max(1, +q.page || 1), limit = Math.min(48, Math.max(1, +q.limit || 12));
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async product(slug: string) {
    const p = await this.products.findOne({ where: { slug, status: 'active' } });
    if (!p) throw new NotFoundException('محصول یافت نشد');
    return { ...p, related: await this.products.find({ where: { status: 'active' }, take: 4 }) };
  }

  async lists() {
    return { categories: await this.categories.find(), collections: await this.collections.find() };
  }

  async createProduct(d: ProductDto) {
    return this.products.save(this.products.create({ ...d, salePrice: d.salePrice ?? null, rating: d.rating ?? 0, stock: d.stock ?? 0 }));
  }

  async updateProduct(id: string, d: Partial<ProductDto>) {
    await this.products.update(id, { ...d, salePrice: d.salePrice ?? null });
    return this.products.findOneByOrFail({ id });
  }

  async allProducts() {
    return this.products.find({ order: { id: 'DESC' } });
  }

  async adminProduct(id: string) {
    return this.products.findOneByOrFail({ id });
  }

  async checkout(userId: string, d: CheckoutDto) {
    const products = await this.products.findBy({ id: In(d.items.map(i => i.productId)) });
    if (products.length !== d.items.length) throw new BadRequestException('محصولی یافت نشد');
    let total = 0;
    const items = d.items.map(i => {
      const p = products.find(x => x.id === i.productId)!;
      if (p.status !== 'active' || p.stock < i.quantity) throw new BadRequestException(`موجودی ${p.name} کافی نیست`);
      const price = p.salePrice ?? p.price;
      total += price * i.quantity;
      return { productId: p.id, name: p.name, price, quantity: i.quantity };
    });
    const user = await this.users.findOneByOrFail({ id: userId });
    if (d.useBalance && user.balance < total) throw new BadRequestException(`اعتبار حساب کافی نیست. اعتبار شما ${user.balance} امتیاز و جمع سفارش ${total} امتیاز است.`);
    const balanceUsed = d.useBalance ? total : 0;
    return this.orders.save(this.orders.create({ userId, status: 'pending', paymentStatus: 'pending', total, balanceUsed, items, shipping: { address: d.address, city: d.city, postalCode: d.postalCode } }));
  }

  async pay(userId: string, id: string, success: boolean) {
    const order = await this.orders.findOneBy({ id });
    if (!order || order.userId !== userId) throw new NotFoundException('سفارش یافت نشد');
    if (order.paymentStatus === 'paid') return order;
    if (!success) {
      order.paymentStatus = 'failed';
      return this.orders.save(order);
    }
    for (const item of order.items) {
      const p = await this.products.findOneByOrFail({ id: item.productId });
      if (p.stock < item.quantity) throw new BadRequestException(`موجودی ${p.name} کافی نیست`);
      p.stock -= item.quantity;
      await this.products.save(p);
      await this.inventory.save(this.inventory.create({ productId: p.id, quantity: -item.quantity, reason: `سفارش ${order.id}` }));
    }
    if (order.balanceUsed) {
      const user = await this.users.findOneByOrFail({ id: userId });
      user.balance -= order.balanceUsed;
      user.creditTransactions.push({ amount: -order.balanceUsed, reason: `استفاده در سفارش ${order.id}`, at: new Date().toISOString() });
      await this.users.save(user);
    }
    order.paymentStatus = 'paid';
    order.status = 'paid';
    return this.orders.save(order);
  }

  async userOrders(id: string) { return this.orders.find({ where: { userId: id }, order: { createdAt: 'DESC' } }); }
  async order(userId: string, id: string, admin = false) { const o = await this.orders.findOneBy({ id }); if (!o || (!admin && o.userId !== userId)) throw new NotFoundException('سفارش یافت نشد'); return o; }
  async allOrders() { return this.orders.find({ order: { createdAt: 'DESC' } }); }
  async orderStatus(id: string, status: string) { await this.orders.update(id, { status }); return this.orders.findOneByOrFail({ id }); }

  async redeem(userId: string, code: string) {
    const normalized = code.replace(/\D/g, '') || code.toUpperCase();
    const c = await this.codes.findOneBy({ code: normalized });
    if (!c || c.status !== 'active' || (c.expiresAt && c.expiresAt < new Date())) throw new BadRequestException('کد شارژ معتبر نیست');
    const u = await this.users.findOneByOrFail({ id: userId });
    u.balance += Number(c.amount);
    u.creditTransactions.push({ amount: Number(c.amount), reason: `شارژ با ${c.code}`, at: new Date().toISOString() });
    if (!c.multiUse) {
      c.status = 'redeemed';
      c.usedById = userId;
      await this.codes.save(c);
    }
    await this.users.save(u);
    return { balance: u.balance, amount: c.amount };
  }

  async codesList() {
    return this.codes.find({ order: { id: 'DESC' } });
  }

  async createCode(d: RedeemCreateDto) {
    const count = Math.min(100, Math.max(1, d.count ?? 1));
    const items: RedeemCode[] = [];
    for (let i = 0; i < count; i += 1) {
      items.push(this.codes.create({ code: await this.uniqueCode(), amount: d.amount, multiUse: d.multiUse ?? false, expiresAt: null, status: 'active' }));
    }
    const saved = await this.codes.save(items);
    return count === 1 ? saved[0] : saved;
  }

  async adjust(id: string, quantity: number, reason: string) {
    const p = await this.products.findOneByOrFail({ id });
    if (p.stock + quantity < 0) throw new BadRequestException('موجودی منفی نمی‌شود');
    p.stock += quantity;
    await this.products.save(p);
    await this.inventory.save(this.inventory.create({ productId: id, quantity, reason }));
    return p;
  }

  async stock() {
    return this.products.find({ order: { stock: 'ASC' } });
  }

  async allUsers() {
    const users = await this.users.find({ order: { balance: 'DESC' } });
    return users.map(({ passwordHash, otpHash, otpExpiresAt, otpAttempts, ...safe }) => safe);
  }

  async addUserBonus(id: string, d: BonusDto) {
    const user = await this.users.findOneByOrFail({ id });
    user.balance += d.amount;
    user.creditTransactions.push({ amount: d.amount, reason: d.reason, at: new Date().toISOString() });
    const saved = await this.users.save(user);
    const { passwordHash, otpHash, otpExpiresAt, otpAttempts, ...safe } = saved;
    return safe;
  }

  async allMissions() {
    return this.missions.find({ order: { createdAt: 'DESC' } });
  }

  async createMission(d: MissionDto) {
    return this.missions.save(this.missions.create(this.missionPayload(d)));
  }

  async updateMission(id: string, d: Partial<MissionDto>) {
    await this.missions.update(id, this.missionPayload(d));
    return this.missions.findOneByOrFail({ id });
  }

  private missionPayload(d: Partial<MissionDto>) {
    return { ...d, startsAt: d.startsAt ? new Date(d.startsAt) : null, endsAt: d.endsAt ? new Date(d.endsAt) : null };
  }

  private async uniqueCode() {
    for (let i = 0; i < 12; i += 1) {
      const code = Math.floor(10000 + Math.random() * 90000).toString();
      if (!await this.codes.findOneBy({ code })) return code;
    }
    throw new BadRequestException('تولید کد یکتا ممکن نشد. دوباره تلاش کنید.');
  }
}
