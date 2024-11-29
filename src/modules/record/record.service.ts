import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/records.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async findAll(): Promise<Record[]> {
    return await this.recordRepository.find();
  }

  async findOne(id: string): Promise<Record> {
    const record = await this.recordRepository.findOne({ where: { id: +id } });
    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
    return record;
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.recordRepository.remove(record);
  }
}
