import { IsEmail, IsString, MaxLength } from 'class-validator';

export class AdminLoginDto {
  @IsEmail() email!: string;
  @IsString() @MaxLength(128) password!: string;
}
