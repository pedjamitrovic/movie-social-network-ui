import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as moment from 'moment';
import { ContextService } from '@services/context/context.service';
import { AuthService } from '@services/auth.service';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { EnvironmentService } from '@services/environment.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  sysEntity: SystemEntityVM;
  showNotificationMenu = false;
  notifications: any[] = [
    { notifier: 'Miki', body: 'Liked your post aaaaaaaaaaaaaaaaaaaaaaa', seen: false, link: '/posts/123' },
    { notifier: 'Miki', body: 'Liked your post', seen: false, link: '/posts/123' },
    { notifier: 'Miki', body: 'Liked your post', seen: false, link: '/posts/123' },
    { notifier: 'Miki', body: 'Liked your post', seen: true, link: '/posts/123' }
  ];
  fromNow: string;
  newNotificationCount = 3;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private contextService: ContextService,
  ) { }

  ngOnInit(): void {
    this.fromNow = moment(new Date()).fromNow();
    this.newNotificationCount = 3;
  }

  toggleNotificationMenu() {
    this.showNotificationMenu = !this.showNotificationMenu;
    if (!this.showNotificationMenu) {
      this.newNotificationCount = 0;
      this.notifications.forEach((e) => e.seen = true);
    }
  }

  notificationClicked(notification: any) {
    notification.seen = true;
    this.newNotificationCount = this.notifications.filter((e) => !e.seen).length;
  }

  switchContext() {
    if (this.authService.authUserValue.discriminator === 'Group') {
      this.authService.switchFromGroup();
    } else {
      this.authService.switchToGroup(4).subscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
