import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { StoreService } from '../application/store.service';
import { ObjectStorageService } from '../application/object-storage.service';
import { BonusDto, CheckoutDto, MissionDto, ProductDto, RedeemCreateDto, RedeemDto, StockDto } from '../application/store.dto';

const auth = AuthGuard('jwt');
function admin(r: { user: { role: string } }) { if (r.user.role !== 'admin') throw new ForbiddenException('دسترسی مدیر لازم است'); }

@ApiTags('store')
@Controller()
export class StoreController {
  constructor(private s: StoreService, private storage: ObjectStorageService) {}

  @Get('products') products(@Query() q: Record<string, string>) { return this.s.catalog(q); }
  @Get('products/:slug') product(@Param('slug') slug: string) { return this.s.product(slug); }
  @Get('catalog') lists() { return this.s.lists(); }
  @Post('checkout') @UseGuards(auth) @ApiBearerAuth() checkout(@Req() r: { user: { id: string } }, @Body() d: CheckoutDto) { return this.s.checkout(r.user.id, d); }
  @Post('payments/:id/mock') @UseGuards(auth) @ApiBearerAuth() pay(@Req() r: { user: { id: string } }, @Param('id') id: string, @Body() d: { success: boolean }) { return this.s.pay(r.user.id, id, d.success); }
  @Get('orders/me') @UseGuards(auth) orders(@Req() r: { user: { id: string } }) { return this.s.userOrders(r.user.id); }
  @Get('orders/:id') @UseGuards(auth) order(@Req() r: { user: { id: string } }, @Param('id') id: string) { return this.s.order(r.user.id, id); }
  @Post('redeem-codes/redeem') @UseGuards(auth) redeem(@Req() r: { user: { id: string } }, @Body() d: RedeemDto) { return this.s.redeem(r.user.id, d.code); }

  @Get('admin/products') @UseGuards(auth) allProducts(@Req() r: { user: { role: string } }) { admin(r); return this.s.allProducts(); }
  @Get('admin/products/:id') @UseGuards(auth) adminProduct(@Req() r: { user: { role: string } }, @Param('id') id: string) { admin(r); return this.s.adminProduct(id); }
  @Post('admin/products') @UseGuards(auth) create(@Req() r: { user: { role: string } }, @Body() d: ProductDto) { admin(r); return this.s.createProduct(d); }
  @Patch('admin/products/:id') @UseGuards(auth) update(@Req() r: { user: { role: string } }, @Param('id') id: string, @Body() d: ProductDto) { admin(r); return this.s.updateProduct(id, d); }
  @Post('admin/uploads/product-image') @UseGuards(auth) @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 6 * 1024 * 1024 } })) uploadProductImage(@Req() r: { user: { role: string } }, @UploadedFile() file: Express.Multer.File) { admin(r); return this.storage.uploadProductImage(file); }
  @Get('admin/orders') @UseGuards(auth) allOrders(@Req() r: { user: { role: string } }) { admin(r); return this.s.allOrders(); }
  @Patch('admin/orders/:id/status') @UseGuards(auth) updateOrder(@Req() r: { user: { role: string } }, @Param('id') id: string, @Body() d: { status: string }) { admin(r); return this.s.orderStatus(id, d.status); }
  @Get('admin/inventory') @UseGuards(auth) stock(@Req() r: { user: { role: string } }) { admin(r); return this.s.stock(); }
  @Post('admin/inventory/:id/adjust') @UseGuards(auth) adjust(@Req() r: { user: { role: string } }, @Param('id') id: string, @Body() d: StockDto) { admin(r); return this.s.adjust(id, d.quantity, d.reason); }
  @Get('admin/redeem-codes') @UseGuards(auth) codes(@Req() r: { user: { role: string } }) { admin(r); return this.s.codesList(); }
  @Post('admin/redeem-codes') @UseGuards(auth) code(@Req() r: { user: { role: string } }, @Body() d: RedeemCreateDto) { admin(r); return this.s.createCode(d); }
  @Get('admin/users') @UseGuards(auth) users(@Req() r: { user: { role: string } }) { admin(r); return this.s.allUsers(); }
  @Post('admin/users/:id/bonus') @UseGuards(auth) bonus(@Req() r: { user: { role: string } }, @Param('id') id: string, @Body() d: BonusDto) { admin(r); return this.s.addUserBonus(id, d); }
  @Get('admin/missions') @UseGuards(auth) missions(@Req() r: { user: { role: string } }) { admin(r); return this.s.allMissions(); }
  @Post('admin/missions') @UseGuards(auth) mission(@Req() r: { user: { role: string } }, @Body() d: MissionDto) { admin(r); return this.s.createMission(d); }
  @Patch('admin/missions/:id') @UseGuards(auth) updateMission(@Req() r: { user: { role: string } }, @Param('id') id: string, @Body() d: MissionDto) { admin(r); return this.s.updateMission(id, d); }
}
