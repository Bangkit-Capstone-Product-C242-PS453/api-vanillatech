import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { HealthCheckModule } from './modules/health/health-check.module';
import { AppController } from './app.controller';
import { typeOrmConfig } from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanModule } from './modules/scan/scan.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    HealthCheckModule,
    AuthModule,
    UserModule,
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
