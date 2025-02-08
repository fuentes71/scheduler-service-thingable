import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICustomResponseInterceptor } from '../interfaces';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(data => {
        const response: ICustomResponseInterceptor = {
          code: res.statusCode,
          success: true,
          data: data,
        };

        return response;
      }),
    );
  }
}
