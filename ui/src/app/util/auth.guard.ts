import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const authUser = this.authService.authUserValue;
    if (authUser) {
      if (route.data.roles && !route.data.roles.includes(authUser.role)) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
