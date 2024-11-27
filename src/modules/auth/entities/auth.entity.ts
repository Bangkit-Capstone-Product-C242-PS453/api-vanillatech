import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth_tokens')
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    token: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
