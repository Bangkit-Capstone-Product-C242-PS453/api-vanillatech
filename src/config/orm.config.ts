import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Auth } from '../modules/auth/entities/auth.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '!Vanilla123',
  database: 'db_vanillatech',
  entities: [User, Auth],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
};
