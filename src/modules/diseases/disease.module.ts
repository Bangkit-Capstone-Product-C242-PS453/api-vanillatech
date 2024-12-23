import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Disease } from '../../entities/disease.entity'
import { DiseaseRecord } from '../../entities/disease-record.entity'
import { DiseaseService } from './disease.service'
import { DiseasesController } from './disease.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [TypeOrmModule.forFeature([Disease, DiseaseRecord]), AuthModule],
    controllers: [DiseasesController],
    providers: [DiseaseService],
    exports: [DiseaseService]
})
export class DiseaseModule {}
