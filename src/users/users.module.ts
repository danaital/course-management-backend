import { Module } from '@nestjs/common';
import { UserController } from './user.controller'; // Correct path
import { UserService } from './user.service'; // Correct path
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity'; // Correct path

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UsersModule {}
