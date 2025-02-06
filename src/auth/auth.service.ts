import { OtpService } from './../otp/otp.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../users/user.service'; // Import UserService

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private otpService: OtpService,
        private userService: UserService // Inject UserService
    ) {}

    async validateUser(loginData: { githubAccount?: string; email?: string; password: string }): Promise<UserEntity | { email: string; otpSent: boolean } | null> {
        const user = await this.userRepository.findOne({
            where: [
                { githubAccount: loginData.githubAccount },
                { email: loginData.email }
            ]
        });
        if (user && await bcrypt.compare(loginData.password, user.password)) {
            if (user.roleId > 1) {
                await this.otpService.sendOTP(user.email); // Send OTP
                return { email: user.email, otpSent: true }; // Indicate that OTP has been sent
            }
            return user;
        }
        return null; 
    }

    async validateOtp(email: string, otpValue: string): Promise<boolean> {
        return this.otpService.verifyOTP(email, otpValue);
    }

    async forgotPassword(email: string, githubAccount: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email); // Ensure this method exists in UserService
        if (user && user.githubAccount === githubAccount) {
            // Logic to send email or generate token
            await this.otpService.sendOTP(email); 
            return true;
        }
        return false; // User not found
    }
}
