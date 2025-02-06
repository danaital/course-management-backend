import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './users/user.entity'; // Updated path
import { RoleEntity } from './roles/role.entity'; // Updated path
import { AuthModule } from './auth/auth.module'; // Import AuthModule
import { OtpModule } from './otp/otp.module'; // Import OtpModule
import { UsersModule } from './users/users.module'; // Import UsersModule
import { RolesModule } from './roles/roles.module'; // Import RolesModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_username', // TODO: env replace with your PostgreSQL username
      password: 'your_password', // TODO: env replace with your PostgreSQL password
      database: 'your_database', // TODO: env replace with your PostgreSQL database name
      entities: [UserEntity, RoleEntity],
      synchronize: true, // set to false in production
    }),
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    AuthModule, // Existing AuthModule
    OtpModule, // Existing OtpModule
    UsersModule, // Add UsersModule here
    RolesModule, // Add RolesModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
