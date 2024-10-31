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
  ) {}

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
    try {
      const { email, password } = loginDto;

      // Find user by email
      const user: UserDocument | null = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const token = this._createToken(user);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('An error occurred during login');
    }
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
    const payload = {
      sub: user._id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}