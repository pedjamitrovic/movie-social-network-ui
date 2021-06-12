import { AuthService } from '@services/auth.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MovieService } from '../services/movie.service';
import { SplashService } from '../services/splash.service';

export function appInitializer(authService: AuthService, movieService: MovieService, splashService: SplashService) {
  return () => new Promise(
    (resolve) => {
      splashService.open();

      const initializers = [
        authService.initAuthUser(),
        movieService.initConfiguration(),
      ]

      forkJoin(initializers)
        .pipe(finalize(() => splashService.close()))
        .subscribe()
        .add(resolve);
    }
  );
}
