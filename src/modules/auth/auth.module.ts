import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('APP_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, AuthGuard, UserService],
  controllers: [AuthController],
  exports: [JwtModule, AuthGuard],
})
export class AuthModule {}
