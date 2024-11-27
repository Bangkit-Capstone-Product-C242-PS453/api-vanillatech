import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  getHello(): string {
    return 'Hello World!';
  }
}