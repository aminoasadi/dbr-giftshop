import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class ObjectStorageService {
  private readonly bucket = process.env.S3_BUCKET || '';
  private readonly publicBaseUrl = (process.env.S3_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  private readonly client = new S3Client({
    region: process.env.S3_REGION || 'ir-thr-at1',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  });

  async uploadProductImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('فایل تصویر ارسال نشده است.');
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('فقط فایل تصویر قابل بارگذاری است.');
    if (!this.bucket || !process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
      throw new InternalServerErrorException('تنظیمات Object Storage کامل نیست.');
    }

    const extension = this.safeExtension(file.originalname, file.mimetype);
    const key = `products/uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extension}`;
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      CacheControl: 'public, max-age=31536000, immutable',
    }));

    return { key, url: this.publicUrl(key), image: this.publicUrl(key) };
  }

  private publicUrl(key: string) {
    if (this.publicBaseUrl) return `${this.publicBaseUrl}/${key}`;
    const endpoint = (process.env.S3_ENDPOINT || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${this.bucket}.${endpoint}/${key}`;
  }

  private safeExtension(name: string, mimetype: string) {
    const extension = extname(name || '').toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(extension)) return extension;
    if (mimetype === 'image/png') return '.png';
    if (mimetype === 'image/webp') return '.webp';
    if (mimetype === 'image/gif') return '.gif';
    if (mimetype === 'image/svg+xml') return '.svg';
    return '.jpg';
  }
}
