import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { EnvironmentService } from '@services/environment.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private environment: EnvironmentService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUser = this.authService.authUserValue;
    const isApiUrl = request.url.startsWith(this.environment.apiUrl);

    if (isApiUrl) {
      request = request.clone(
        {
          setHeaders: { Authorization: `Bearer ${authUser.token}` }
        }
      );
    }

    return next.handle(request);
  }
}
