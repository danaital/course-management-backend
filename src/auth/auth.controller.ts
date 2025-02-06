import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service'; // Import UserService
import { UserEntity } from '../users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService // Inject UserService
    ) {}

    @Post('register')
    async register(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
        return this.userService.createUser(userData); // Use UserService for user creation
    }

    @Post('login')
    async login(@Body() loginData: { githubAccount?: string; email?: string; password: string }): Promise<UserEntity | { email: string; otpSent: boolean } | null> {
        return this.authService.validateUser(loginData);
    }

    @Post('validate-otp')
    async validateOtp(@Body() otpData: { email: string; otpValue: string }): Promise<boolean> {
        return this.authService.validateOtp(otpData.email, otpData.otpValue);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() userData: { email: string, githubAccount: string}): Promise<boolean> {
        return this.authService.forgotPassword(userData.email, userData.githubAccount);
    }
}
