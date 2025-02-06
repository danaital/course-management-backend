import { OtpService } from './../otp/otp.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private otpService: OtpService
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
}
