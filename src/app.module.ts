import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { HealthCheckModule } from './modules/health/health-check.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScanModule } from './modules/scan/scan.module';
// import { UserModule } from './modules/user/user.module';
import { RecordModule } from './modules/record/record.module';
import { DiseaseModule } from './modules/diseases/disease.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    HealthCheckModule,
    AuthModule,
        // UserModule,
    DiseaseModule,
    RecordModule,
    ScanModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('user/*');
  }
}
