import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity()
export class OtpEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity, user => user.id)
    user: UserEntity;

    @Column()
    value: string;

    @Column()
    createDate: Date;
}
