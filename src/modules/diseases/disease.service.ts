import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disease } from './entities/disease.entity';
import { DiseaseRecord } from './entities/disease-record.entity';

@Injectable()
export class DiseaseService {
  constructor(
    @InjectRepository(Disease) private diseaseRepo: Repository<Disease>,
    @InjectRepository(DiseaseRecord)
    private diseaseRecordRepo: Repository<DiseaseRecord>,
  ) {}

  async findAll() {
    return await this.diseaseRepo.find();
  }

  async findDiseaseById(id: number) {
    return await this.diseaseRepo.findOneBy({ id });
  }

  async findDiseaseByName(name: string): Promise<Disease> {
    return await this.diseaseRepo
      .createQueryBuilder('disease')
      .where('disease.name LIKE :name', { name: `%${name}%` })
      .getOne();
  }

  async createDiseaseRecord(data: Partial<DiseaseRecord>) {
    const record = this.diseaseRecordRepo.create(data);
    return await this.diseaseRecordRepo.save(record);
  }

  async findAllDiseaseRecords() {
    return await this.diseaseRecordRepo.find({
      relations: ['record', 'disease'],
    });
  }

  async findDiseaseRecordById(id: number) {
    return await this.diseaseRecordRepo.findOne({
      where: { id },
      relations: ['record', 'disease'],
    });
  }

  async deleteDiseaseRecord(id: number) {
    return await this.diseaseRecordRepo.delete(id);
  }
}
