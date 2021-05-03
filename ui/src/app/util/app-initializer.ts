import { AuthService } from '@services/auth.service';

export function appInitializer(authService: AuthService) {
  return () => new Promise(
    (resolve) => {
      authService.initAuthUser()
        .subscribe()
        .add(resolve);
    }
  );
}
