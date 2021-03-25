import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUser = this.authService.authUserValue;
    return next.handle(request).pipe(
      catchError(
        (err) => {
          if ([401, 403].includes(err.status) && authUser) {
            this.authService.logout();
          }

          const error = (err && err.error) || err.statusText;
          console.error(err);

          return throwError(err.error);
        }
      )
    );
  }
}
