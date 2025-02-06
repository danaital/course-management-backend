import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service'; // Updated import path
import { UserEntity } from './user.entity';
import { OtpService } from '../otp/otp.service';

@Controller('users')
export class UserController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly otpService: OtpService // Added otpService
    ) {}

    @Post('request-otp')
    async requestOTP(@Body() data: { email: string }): Promise<string> {
        return this.otpService.sendOTP(data.email); // Use AuthService for OTP
    }

    @Post('verify-otp')
    async verifyOTP(@Body() data: { email: string; otp: string }): Promise<boolean> {
        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            return false; // User not found
        }
        return this.userService.verifyOTP(user, data.otp); // Use AuthService
    }

    @Post('validate-user') // New endpoint for user validation
    async validateUser(@Body() loginData: { githubAccount?: string; email?: string; password: string }): Promise<UserEntity | { email: string; otpSent: boolean } | null> {
        return this.authService.validateUser(loginData); // Call validateUser from AuthService
    }
}
