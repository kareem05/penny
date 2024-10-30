  // apps/api/src/app/auth/auth.controller.ts
  import { Controller, Post, Body } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { SignUpDto, LoginDto, ForgotPasswordDto } from './dto/auth.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
      return this.authService.signUp(signUpDto);
    }
  
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
  
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgotPassword(forgotPasswordDto);
    }
  }
  