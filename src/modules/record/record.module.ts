import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { Record } from './entities/records.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
