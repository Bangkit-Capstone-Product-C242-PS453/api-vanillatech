import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { DiseaseRecord } from 'src/entities/disease-record.entity';

@Entity('records')
export class Record {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => DiseaseRecord, diseaseRecord => diseaseRecord.record, { nullable: true })
    diseaseRecords: DiseaseRecord[];

    @ManyToOne(() => User, user => user.id, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @Column({ nullable: true })
    image: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
