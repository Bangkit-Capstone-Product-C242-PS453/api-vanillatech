import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Disease } from '../entities/disease.entity';
import { Record } from '../entities/record.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { DiseaseRecord } from 'src/entities/disease-record.entity';

export const typeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [User, RefreshToken, Disease, Record, DiseaseRecord],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
  };
};
