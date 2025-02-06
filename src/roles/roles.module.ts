import { Module } from '@nestjs/common';
import { RoleEntity } from './role.entity'; // Correct path
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity])],
    // Add controllers and providers as needed
})
export class RolesModule {}
