import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUser = this.authService.authUserValue;
    return next.handle(request).pipe(
      catchError(
        (err) => {
          if (err.status === 401 || err.status === 403) {
            if (authUser.isBanned) {
              this.router.navigate(['/banned']);
            } else {
              this.authService.logout();
            }
          }

          console.error(err);

          return throwError(err.error);
        }
      )
    );
  }
}
