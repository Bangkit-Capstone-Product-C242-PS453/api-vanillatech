import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { RecordModule } from '../record/record.module';
import { DiseaseModule } from '../diseases/disease.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, RecordModule, DiseaseModule, AuthModule],
  controllers: [ScanController],
  providers: [ScanService],
})
export class ScanModule {}
