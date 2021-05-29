import { AuthService } from '@services/auth.service';
import { finalize } from 'rxjs/operators';
import { SplashService } from '../services/splash.service';

export function appInitializer(authService: AuthService, splashService: SplashService) {
  return () => new Promise(
    (resolve) => {
      splashService.open();
      authService.initAuthUser()
        .pipe(finalize(() => splashService.close()))
        .subscribe()
        .add(resolve);
    }
  );
}
