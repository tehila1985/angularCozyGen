import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

const MAX_RETRY_ATTEMPTS = 2;
const RETRY_BASE_DELAY_MS = 500;

function shouldRetryRequest(method: string, error: unknown): boolean {
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    return false;
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return true;
    }

    return [429, 500, 502, 503, 504].includes(error.status);
  }

  return false;
}

@Injectable()
export class HttpRetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, retryCount) => {
            const attempt = retryCount + 1;
            if (!shouldRetryRequest(req.method, error) || attempt > MAX_RETRY_ATTEMPTS) {
              return throwError(() => error);
            }

            const delayMs = RETRY_BASE_DELAY_MS * Math.pow(2, retryCount);
            return timer(delayMs);
          })
        )
      )
    );
  }
}
