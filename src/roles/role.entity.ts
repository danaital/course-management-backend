import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // Values: Student, Class Rep, Workshop Leader, TA, Instructor, GOD
}
