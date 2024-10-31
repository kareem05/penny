// apps/api/src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, USER_MODEL } from './schemas/user.schema';
import { SignUpDto, LoginDto, ForgotPasswordDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    console.log('AuthService constructor - jwtService:', !!this.jwtService);
  }

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { email, password, name } = signUpDto;

    // Check if user exists
    const existingUser: UserDocument | null = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user: UserDocument = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate token
    const token = this._createToken(user);

    return {
      user: { id: user._id, email: user.email, name: user.name },
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    console.log('Login attempt for email:', loginDto.email);
    console.log('JwtService available in login:', !!this.jwtService);
    
    const user = await this.userModel.findOne({ email: loginDto.email });
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('About to create token - jwtService exists:', !!this.jwtService);
    const token = this._createToken(user);
    console.log('Token generated successfully');
    
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    const user: UserDocument | null = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate reset token
    const resetToken = this.jwtService.sign({ email }, { expiresIn: '1h' });

    // Update user with reset token
    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send email with reset token
    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new Error('Failed to send reset email');
    }
  }

  private _createToken(user: UserDocument): string {
    console.log('_createToken called - jwtService exists:', !!this.jwtService);
    console.log('jwtService methods:', Object.keys(this.jwtService || {}));
    
    if (!this.jwtService) {
      throw new Error('JwtService is not properly injected');
    }

    const payload = {
      sub: user._id,
      email: user.email,
    };
    console.log('Creating token with payload:', payload);
    
    try {
      const token = this.jwtService.sign(payload);
      console.log('Token created successfully');
      return token;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }
}