import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    // TODO: Create a new user here, auth controller calls this method
    async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
        userData.roleId = 1; // Set default role to Student
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({ ...userData, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async validateUser(loginData: { githubAccount?: string; email?: string; password: string }): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({
            where: [
                { githubAccount: loginData.githubAccount },
                { email: loginData.email }
            ]
        });
        if (user && await bcrypt.compare(loginData.password, user.password)) {
            if (user.roleId > 1) {
                this.sendOTP(user.email);
                return null;
            }
            return user;
        }
        return null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async sendOTP(email: string): Promise<string> {
        const otp = Math.floor(Math.random() * 1000000).toString(); // Generate a 6-digit OTP
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
                user: process.env.EMAIL_USER, // Use environment variable
                pass: process.env.EMAIL_PASS, // Use environment variable
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        });
        // TODO: Store the OTP in the database for verification
        return otp; // Return the OTP for verification
    }

    verifyOTP(user: UserEntity, otp: string): boolean {
        // TODO: Implement your OTP verification logic here
        return true; // Placeholder
    }
}
