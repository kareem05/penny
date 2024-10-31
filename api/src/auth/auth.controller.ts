  // apps/api/src/app/auth/auth.controller.ts
  import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { SignUpDto, LoginDto, ForgotPasswordDto } from './dto/auth.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {
      console.log('AuthController initialized with authService:', !!this.authService);
    }
  
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
      console.log('Signup attempt with data:', signUpDto);
      const { type, ...signUpData } = signUpDto as any;
      return this.authService.signUp(signUpData);
    }
  
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
      console.log('Login attempt with data:', loginDto);
      try {
        const { type, ...loginData } = loginDto as any;
        return await this.authService.login(loginData);
      } catch (error) {
        throw new UnauthorizedException(error.message);
      }
    }
  
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgotPassword(forgotPasswordDto);
    }
  }
  