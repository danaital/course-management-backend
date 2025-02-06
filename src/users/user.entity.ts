import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from '../roles/role.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true, nullable: true }) // Make githubAccount nullable
    githubAccount: string;

    @Column()
    password: string;

    @Column({ unique: true }) // Ensure email is unique
    email: string;

    @Column()
    roleId: number;

    @ManyToOne(() => RoleEntity, role => role.id)
    role: RoleEntity; // Establishing relationship with RoleEntity
}
