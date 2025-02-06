import { Injectable } from '@nestjs/common';
import { OtpEntity } from './otp.entity';
import { UserService } from '../users/user.service'; // Updated import path
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(OtpEntity)
        private otpRepository: Repository<OtpEntity>,
        private userService: UserService,
    ) {}

    async sendOTP(email: string): Promise<string> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const otpValue = Math.floor(Math.random() * 1000000).toString(); // Generate a 6-digit OTP
        const otp = this.otpRepository.create({
            userId: user.id,
            value: otpValue,
            createDate: new Date(),
        });

        await this.otpRepository.save(otp);
        return otpValue; // Return the OTP for verification
    }

    async verifyOTP(email: string, otpValue: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return false; // User not found
        }

        const otp = await this.otpRepository.findOne({ where: { userId: user.id, value: otpValue } });
        if (!otp) {
            return false; // OTP not found
        }
        if (otp.createDate.getTime() + 300000 < new Date().getTime()) {
            return false; // OTP expired
        }
        if (otp.value !== otpValue) {
            return false; // OTP does not match
        }
        await this.otpRepository.delete(otp);
        return true; // Successful verification
    }
}
