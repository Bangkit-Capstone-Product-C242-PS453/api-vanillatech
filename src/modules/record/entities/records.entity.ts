import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/users.entity';

@Entity('records')
export class Record {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @Column({ nullable: true })
    image: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
