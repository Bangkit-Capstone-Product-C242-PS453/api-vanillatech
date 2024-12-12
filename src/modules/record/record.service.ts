import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from '@google-cloud/storage';
import { Record } from '../../entities/record.entity';
import { CreateRecordDto } from './dtos/create.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class RecordService {
  private storageClient = new Storage();
  private bucketName = 'predict-images';

  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    return this.recordRepository.save(
      this.recordRepository.create({
        ...createRecordDto,
        user: { id: createRecordDto.id_user } as User,
      }),
    );
  }

  async findAll(): Promise<Record[]> {
    return this.recordRepository.find({
      relations: ['diseaseRecords', 'diseaseRecords.disease'],
    });
  }

  async findAllByUser(id_user: number): Promise<Record[]> {
    return this.recordRepository.find({
      where: { user: { id: id_user } },
      relations: ['diseaseRecords', 'diseaseRecords.disease'],
    });
  }

  async findOne(id: number): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: { id },
      relations: ['diseaseRecords', 'diseaseRecords.disease', 'user'],
    });

    if (!record) throw new NotFoundException(`Record with id ${id} not found`);
    if (record.user) delete record.user.password;

    return record;
  }

  async remove(id: number, id_user: number): Promise<{ message: string }> {
    const record = await this.findOne(id);

    if (record.user.id != id_user)
      throw new BadRequestException(
        'User does not have permission to delete this record.',
      );
    if (record.image) await this.deleteFromGCS(record.image);

    await this.recordRepository.remove(record);

    return { message: `Record with id ${id} successfully deleted.` };
  }

  private async deleteFromGCS(imageUrl: string): Promise<void> {
    const filePath = imageUrl.split(`${this.bucketName}/`)[1];
    if (!filePath) throw new Error('Invalid URL');

    try {
      await this.storageClient.bucket(this.bucketName).file(filePath).delete();
    } catch (err) {
      if (err.code === 404) throw new NotFoundException('File not found');
      throw new Error(`Failed to delete file: ${err.message}`);
    }
  }
}
