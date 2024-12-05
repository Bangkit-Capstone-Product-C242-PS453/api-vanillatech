import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diseases')
export class Disease {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    symptoms: string;

    @Column({ nullable: true })
    prevention: string;
}
