import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '@models/user.model';
import { UserService } from '@services/user/user.service';
import * as moment from 'moment';

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
  user: User;
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
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.generateUser();
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

}
