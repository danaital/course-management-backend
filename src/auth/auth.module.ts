import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service'; // Updated import path
import { UserEntity } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpModule } from '../otp/otp.module'; // Import OtpModule

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), OtpModule], // Include OtpModule
    controllers: [AuthController],
    providers: [AuthService, UserService],
})
export class AuthModule {}
