import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { CreateRecordDto } from './dtos/create.dto';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const record = this.recordRepository.create(createRecordDto);
    return this.recordRepository.save(record);
  }

  async findAll(): Promise<Record[]> {
    return await this.recordRepository.find({
      relations: ['diseaseRecords', 'diseaseRecords.disease'],
    });
  }

  async findOne(id: number): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: { id: +id },
      relations: ['diseaseRecords', 'diseaseRecords.disease'],
    });
    if (!record) throw new NotFoundException(`Record with id ${id} not found`);
    return record;
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.recordRepository.remove(record);
  }
}
