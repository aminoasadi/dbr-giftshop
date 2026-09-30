import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { createHash, timingSafeEqual } from 'crypto';
import { User } from '../../users/infrastructure/user.entity';
import { AdminLoginDto } from '../application/admin-login.dto';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(@InjectRepository(User) private users: Repository<User>, private jwt: JwtService) {}
  @Post('login')
  async login(@Body() dto: AdminLoginDto) {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const digest = (value: string) => createHash('sha256').update(value).digest();
    if (!email || !password || dto.email.trim().toLowerCase() !== email || !timingSafeEqual(digest(dto.password), digest(password))) {
      throw new UnauthorizedException('ایمیل یا رمز عبور نادرست است');
    }
    let user = await this.users.findOneBy({ email });
    if (!user) user = await this.users.save(this.users.create({ email, fullName: 'مدیر فروشگاه', role: 'customer' }));
    return { accessToken: this.jwt.sign({ sub: user.id, email, role: 'admin', adminSession: true }, { expiresIn: '2h' }) };
  }
}
