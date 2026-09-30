import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './modules/users/infrastructure/user.entity';
import { Product, Category, Collection, InventoryTransaction, ProductVariant, Mission } from './modules/catalog/infrastructure/catalog.entity';
import { Order } from './modules/orders/infrastructure/order.entity';
import { RedeemCode } from './modules/redeem-codes/infrastructure/redeem-code.entity';
import { merchandiseCategories, merchandiseProducts } from './modules/catalog/application/merchandise-data';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgres://gift_shop:gift_shop@localhost:5432/gift_shop',
  entities: [User, Product, Category, Collection, ProductVariant, InventoryTransaction, Mission, Order, RedeemCode],
  synchronize: true,
});

async function seed() {
  await ds.initialize();

  const users = ds.getRepository(User);
  const categories = ds.getRepository(Category);
  const collections = ds.getRepository(Collection);
  const products = ds.getRepository(Product);
  const codes = ds.getRepository(RedeemCode);
  const missions = ds.getRepository(Mission);

  if (!await users.findOneBy({ email: 'admin@gift.local' })) {
    await users.save([
      { email: 'admin@gift.local', fullName: 'مدیر فروشگاه', passwordHash: await bcrypt.hash('Admin123!', 12), role: 'admin' },
      { email: 'customer@gift.local', fullName: 'مشتری نمونه', passwordHash: null, role: 'customer' },
    ]);
  }

  for (const category of merchandiseCategories) {
    if (!await categories.findOneBy({ slug: category.slug })) {
      await categories.save(categories.create(category));
    }

    if (!await collections.findOneBy({ slug: category.slug })) {
      await collections.save(collections.create({ ...category, description: `منتخب ${category.name}` }));
    }
  }

  const categoryRows = await categories.find();
  const collectionRows = await collections.find();

  for (const item of merchandiseProducts) {
    const existing = await products.findOneBy({ slug: item.slug });
    const category = categoryRows.find(row => row.slug === item.category.slug);
    const collection = collectionRows.find(row => row.slug === item.category.slug);
    const payload = {
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      description: item.description,
      price: item.price,
      salePrice: item.salePrice,
      status: item.status,
      color: item.color,
      giftSuitable: item.giftSuitable,
      image: item.image,
      rating: item.rating,
      stock: item.stock,
      categoryId: category?.id,
      collectionId: collection?.id,
    };

    await products.save(existing ? { ...existing, ...payload } : products.create(payload));
  }

  if (!await missions.count()) {
    await missions.save([
      { title: 'تکمیل پروفایل', description: 'کاربر پس از تکمیل اطلاعات حساب امتیاز می‌گیرد.', points: 50, status: 'active' },
      { title: 'اولین خرید', description: 'پس از ثبت اولین سفارش پرداخت‌شده، امتیاز تشویقی اضافه می‌شود.', points: 120, status: 'active' },
    ]);
  }

  for (const [code, amount] of [['10000', 100], ['25000', 250], ['50050', 50]] as Array<[string, number]>) {
    if (!await codes.findOneBy({ code })) await codes.save({ code, amount, status: 'active', expiresAt: null });
  }

  await ds.destroy();
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
