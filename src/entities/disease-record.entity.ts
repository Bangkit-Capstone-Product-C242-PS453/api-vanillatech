import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Record } from './record.entity';
import { Disease } from './disease.entity';

@Entity('diseases_records')
export class DiseaseRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Record, record => record.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_record' })
    record: Record;

    @ManyToOne(() => Disease, disease => disease.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_disease' })
    disease: Disease;
}
