import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './otp.entity';
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
    imports: [TypeOrmModule.forFeature([OtpEntity]), UsersModule], // Include UsersModule
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule {}
