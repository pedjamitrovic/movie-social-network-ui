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
    const activeSE = this.authService.activeSystemEntityValue;
    const activeAuthInfo = this.authService.authUserValue;
    if (activeSE) {
      if (route.data.roles && !route.data.roles.includes(activeSE.role)) {
        this.router.navigate(['/']);
        return false;
      }

      if (activeAuthInfo.isBanned) {
        this.router.navigate(['/banned']);
        return true;
      }

      return true;
    }
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
