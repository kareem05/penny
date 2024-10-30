// apps/api/src/app/auth/dto/auth.dto.ts
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
