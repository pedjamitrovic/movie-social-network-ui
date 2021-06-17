import { AuthService } from '@services/auth.service';
import { finalize, switchMap } from 'rxjs/operators';
import { MovieService } from '@services/movie.service';
import { SplashService } from '@services/splash.service';

export function appInitializer(authService: AuthService, movieService: MovieService, splashService: SplashService) {
  return () => new Promise(
    (resolve) => {
      splashService.open();

      const initMovieConfig = movieService.initConfiguration();

      initMovieConfig
        .pipe(
          switchMap(() => authService.initAuthUser()),
          finalize(() => splashService.close())
        )
        .subscribe()
        .add(resolve);
    }
  );
}
