import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (!value || (Array.isArray(value) && value.length === 0))
          throw new NotFoundException();

        // for pagination info
        if (Array.isArray(value)) return value;

        return { data: value };
      }),
    );
  }
}
