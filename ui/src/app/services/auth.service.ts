import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EnvironmentService } from '@services/environment.service';
import { AuthenticationInfo } from '@models/authentication-info.model';
import { RegisterCommand } from '@models/register-command.model';
import { LoginCommand } from '@models/login-command.model';
import { UserVM } from '@models/user-vm.model';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { UserService } from './user/user.service';
import { Constants } from '@util/constants';
import { GroupVM } from '@models/group-vm.model';
import { GroupService } from './group.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersApiUrl: string;
  private groupsApiUrl: string;

  private authUserSubject: BehaviorSubject<AuthenticationInfo>;
  private authGroupSubject: BehaviorSubject<AuthenticationInfo>;
  private loggedUserSubject: BehaviorSubject<UserVM>;
  private activeSystemEntitySubject: BehaviorSubject<SystemEntityVM>;

  authUser: Observable<AuthenticationInfo>;
  loggedUser: Observable<UserVM>;
  activeSystemEntity: Observable<SystemEntityVM>;

  constructor(
    private router: Router,
    private environment: EnvironmentService,
    private http: HttpClient,
    private userService: UserService,
    private groupService: GroupService,
  ) {
    this.usersApiUrl = `${this.environment.apiUrl}/users`;
    this.groupsApiUrl = `${this.environment.apiUrl}/groups`;

    this.authUserSubject = new BehaviorSubject<AuthenticationInfo>(null);
    this.authGroupSubject = new BehaviorSubject<AuthenticationInfo>(null);
    this.loggedUserSubject = new BehaviorSubject<UserVM>(null);
    this.activeSystemEntitySubject = new BehaviorSubject<SystemEntityVM>(null);

    this.authUser = this.authUserSubject.asObservable();
    this.loggedUser = this.loggedUserSubject.asObservable();
    this.activeSystemEntity = this.activeSystemEntitySubject.asObservable();
  }

  get authUserValue(): AuthenticationInfo {
    return this.authGroupSubject.value || this.authUserSubject.value;
  }

  get loggedUserValue(): UserVM {
    return this.loggedUserSubject.value;
  }

  get activeSystemEntityValue(): SystemEntityVM {
    return this.activeSystemEntitySubject.value;
  }

  initAuthUser() {
    const authUser = JSON.parse(localStorage.getItem(Constants.MSN_AUTH_USER_KEY)) as AuthenticationInfo;
    const authGroup = JSON.parse(localStorage.getItem(Constants.MSN_AUTH_GROUP_KEY)) as AuthenticationInfo;

    if (!authUser) { return of(); }

    this.authUserSubject.next(authUser);
    this.authGroupSubject.next(authGroup);

    const fetchEntities = [];

    if (authUser) {
      const getUserObs = this.userService.getById(authUser.id).pipe(
        tap(
          (user: UserVM) => {
            this.loggedUserSubject.next(user);
            this.activeSystemEntitySubject.next(user);
          }
        )
      );
      fetchEntities.push(getUserObs);
    }

    if (authGroup) {
      const getGroupObs = this.groupService.getById(authGroup.id).pipe(
        tap(
          (group: GroupVM) => {
            this.activeSystemEntitySubject.next(group);
          }
        )
      );
      fetchEntities.push(getGroupObs);
    }

    return concat(...fetchEntities);
  }

  login(command: LoginCommand) {
    return this.http.post<AuthenticationInfo>(`${this.usersApiUrl}/login`, command)
      .pipe(
        switchMap(
          (authUser: AuthenticationInfo) => {
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
    return this.http.post<AuthenticationInfo>(`${this.usersApiUrl}/register`, command).pipe(
      switchMap(
        (authUser: AuthenticationInfo) => {
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

  switchToGroup(id: number) {
    return this.http.post<AuthenticationInfo>(`${this.groupsApiUrl}/${id}/login`, {})
      .pipe(
        switchMap(
          (authInfo: AuthenticationInfo) => {
            this.authGroupSubject.next(authInfo);
            localStorage.setItem(Constants.MSN_AUTH_GROUP_KEY, JSON.stringify(authInfo));
            return this.groupService.getById(authInfo.id);
          }
        ),
        tap(
          (group: GroupVM) => {
            this.activeSystemEntitySubject.next(group);
          }
        ),
      );
  }

  switchFromGroup() {
    localStorage.removeItem(Constants.MSN_AUTH_GROUP_KEY);
    this.authGroupSubject.next(null);
    this.initAuthUser().subscribe(() => this.router.navigate(['users', this.loggedUserValue.id]));
  }

  logout() {
    this.authUserSubject.next(null);
    this.authGroupSubject.next(null);
    this.loggedUserSubject.next(null);
    this.activeSystemEntitySubject.next(null);

    localStorage.removeItem(Constants.MSN_AUTH_USER_KEY);
    localStorage.removeItem(Constants.MSN_AUTH_GROUP_KEY);

    this.router.navigate(['/']);
  }
}
