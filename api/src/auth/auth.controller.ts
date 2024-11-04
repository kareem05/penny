// apps/api/src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, ForgotPasswordDto } from './dto/auth.dto';

// Optionally, log the AuthService to verify it's imported
console.log('AuthService imported:', AuthService);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log('AuthController AuthService:', !!this.authService);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    console.log('Signup attempt with data:', signUpDto);
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Login attempt with data:', loginDto);
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    console.log('Forgot password attempt with data:', forgotPasswordDto);
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}