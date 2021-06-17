import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCommand } from '@models/request/login-command.model';
import { RegisterCommand } from '@models/request/register-command.model';
import { AuthenticationInfo } from '@models/response/authentication-info.model';
import { GroupVM } from '@models/response/group-vm.model';
import { SystemEntityVM } from '@models/response/system-entity-vm.model';
import { UserVM } from '@models/response/user-vm.model';
import { EnvironmentService } from '@services/environment.service';
import { GroupService } from '@services/group.service';
import { SignalrService } from '@services/signalr.service';
import { UserService } from '@services/user.service';
import { Constants } from '@util/constants';
import { BehaviorSubject, concat, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersApiUrl = `${this.environment.apiUrl}/users`;
  private groupsApiUrl = `${this.environment.apiUrl}/groups`;

  private authUserSubject = new BehaviorSubject<AuthenticationInfo>(null);
  private authGroupSubject = new BehaviorSubject<AuthenticationInfo>(null);
  private loggedUserSubject = new BehaviorSubject<UserVM>(null);
  private activeSystemEntitySubject = new BehaviorSubject<SystemEntityVM>(null);

  authUser = this.authUserSubject.asObservable();
  loggedUser = this.loggedUserSubject.asObservable();
  activeSystemEntity = this.activeSystemEntitySubject.asObservable();

  get authUserValue(): AuthenticationInfo {
    return this.authGroupSubject.value || this.authUserSubject.value;
  }

  get loggedUserValue(): UserVM {
    return this.loggedUserSubject.value;
  }

  get activeSystemEntityValue(): SystemEntityVM {
    return this.activeSystemEntitySubject.value;
  }

  constructor(
    private router: Router,
    private environment: EnvironmentService,
    private http: HttpClient,
    private userService: UserService,
    private groupService: GroupService,
    private signalrService: SignalrService,
  ) {
    this.subscribeSignalR();
  }

  subscribeSignalR() {
    this.activeSystemEntitySubject.subscribe(
      (sysEntity) => {
        if (sysEntity && !this.authUserValue.isBanned) {
          this.signalrService.initiateSignalrConnection(this.authUserValue.token);
        }
      }
    );
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
