import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck(): string {
    return JSON.stringify({
      message: 'Server is up',
    });
  }
}
