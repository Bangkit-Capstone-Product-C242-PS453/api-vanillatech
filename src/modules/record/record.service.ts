import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from '@google-cloud/storage';
import { Record } from './entities/record.entity';
import { CreateRecordDto } from './dtos/create.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RecordService {
  private storageClient = new Storage();
  private bucketName = 'predict-images';

  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const record = this.recordRepository.create({
      ...createRecordDto,
      user: { id: createRecordDto.id_user } as User,
    });

    return this.recordRepository.save(record);
  }

  async findAll(): Promise<Record[]> {
    return this.recordRepository.find({
      relations: ['diseaseRecords', 'diseaseRecords.disease'],
    });
  }

  async findAllByUser(id_user: number): Promise<Record[]> {
    const records = await this.recordRepository.find({
      where: { user: { id: id_user } },
      relations: ['diseaseRecords', 'diseaseRecords.disease'],
    });

    if (!records.length)
      throw new NotFoundException(
        `No records found for user with id ${id_user}`,
      );

    return records;
  }

  async findOne(id: number): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: { id: +id },
      relations: ['diseaseRecords', 'diseaseRecords.disease'],
    });
    if (!record) throw new NotFoundException(`Record with id ${id} not found`);
    return record;
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const record = await this.findOne(id);
      if (record.image) await this.deleteFromGCS(record.image);
      await this.recordRepository.remove(record);
      return { message: `Record with id ${id} successfully deleted.` };
    } catch (err) {
      throw new NotFoundException(`Failed to delete record with id ${id}: ${err.message}`);
    }
  }

  private async deleteFromGCS(imageUrl: string): Promise<void> {
    const filePath = imageUrl.split(`${this.bucketName}/`)[1];
    if (!filePath) throw new Error('Invalid GCS URL');

    try {
      await this.storageClient.bucket(this.bucketName).file(filePath).delete();
    } catch (err) {
      if (err.code === 404)
        throw new NotFoundException('File not found in GCS');
      throw new Error(`Failed to delete file from GCS: ${err.message}`);
    }
  }
}
