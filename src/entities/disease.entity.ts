import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diseases')
export class Disease {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'json', nullable: true })
    symptoms: string[];

    @Column({ type: 'json', nullable: true })
    prevention: string[];
}
