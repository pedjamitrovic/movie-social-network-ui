import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { EnvironmentService } from '@services/environment.service';

import { Account } from '@models/account.model';
import { AuthenticatedUser } from '@models/authenticated-user.model';
import { RegisterCommand } from '@models/register-command.model';
import { LoginCommand } from '@models/login-command.model';
import { UserVM } from '@models/user-vm.model';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { UserService } from './user/user.service';
import { Constants } from '@util/constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string;

  private authUserSubject: BehaviorSubject<AuthenticatedUser>;
  private loggedUserSubject: BehaviorSubject<UserVM>;
  private activeSystemEntitySubject: BehaviorSubject<SystemEntityVM>

  authUser: Observable<AuthenticatedUser>;
  loggedUser: Observable<UserVM>;
  activeSystemEntity: Observable<SystemEntityVM>;

  constructor(
    private router: Router,
    private environment: EnvironmentService,
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/users`;

    this.authUserSubject = new BehaviorSubject<AuthenticatedUser>(null);
    this.loggedUserSubject = new BehaviorSubject<UserVM>(null);
    this.activeSystemEntitySubject = new BehaviorSubject<SystemEntityVM>(null);

    this.authUser = this.authUserSubject.asObservable();
    this.loggedUser = this.loggedUserSubject.asObservable();
    this.activeSystemEntity = this.activeSystemEntitySubject.asObservable();

    //this.initAuthUser();
  }

  get authUserValue(): AuthenticatedUser {
    return this.authUserSubject.value;
  }

  get loggedUserValue(): UserVM {
    return this.loggedUserSubject.value;
  }

  get activeSystemEntityValue(): SystemEntityVM {
    return this.activeSystemEntitySubject.value;
  }

  initAuthUser() {
    const authUser = JSON.parse(localStorage.getItem(Constants.MSN_AUTH_USER_KEY)) as AuthenticatedUser;
    if (!authUser) { return of(); }

    this.authUserSubject.next(authUser);

    return this.userService.getById(authUser.id).pipe(
      tap(
        (user: UserVM) => {
          this.loggedUserSubject.next(user);
          this.activeSystemEntitySubject.next(user);
          console.log(user);
        }
      )
    );
  }

  login(command: LoginCommand) {
    return this.http.post<AuthenticatedUser>(`${this.apiUrl}/login`, command)
      .pipe(
        switchMap(
          (authUser: AuthenticatedUser) => {
            this.authUserSubject.next(authUser);
            localStorage.setItem(Constants.MSN_AUTH_USER_KEY, JSON.stringify(authUser));
            return this.userService.getById(authUser.id);
          }
        ),
        tap(
          (user: UserVM) => {
            this.loggedUserSubject.next(user);
            this.activeSystemEntitySubject.next(user);
          }
        ),
      );
  }

  register(command: RegisterCommand) {
    return this.http.post<AuthenticatedUser>(`${this.apiUrl}/register`, command).pipe(
      switchMap(
        (authUser: AuthenticatedUser) => {
          this.authUserSubject.next(authUser);
          localStorage.setItem(Constants.MSN_AUTH_USER_KEY, JSON.stringify(authUser));
          return this.userService.getById(authUser.id);
        }
      ),
      tap(
        (user: UserVM) => {
          this.loggedUserSubject.next(user);
          this.activeSystemEntitySubject.next(user);
        }
      ),
    );
  }

  logout() {
    this.authUserSubject.next(null);
    this.loggedUserSubject.next(null);
    this.activeSystemEntitySubject.next(null);

    localStorage.removeItem(Constants.MSN_AUTH_USER_KEY);

    this.router.navigate(['/home']);
  }
}
