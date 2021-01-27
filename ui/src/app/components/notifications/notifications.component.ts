import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  notifications: any[] = [
    { notifier: 'Miki', body: 'Liked your post aaaaaaaaaaaaaaaaaaaaaaa', seen: false, link: '/posts/123' },
    { notifier: 'Miki', body: 'Liked your post', seen: false, link: '/posts/123' },
    { notifier: 'Miki', body: 'Liked your post', seen: false, link: '/posts/123' },
    { notifier: 'Miki', body: 'Liked your post', seen: true, link: '/posts/123' }
  ];
  pagedNotifications: any[];
  pageSize = 8;
  fromNow: string;

  constructor() { }

  ngOnInit(): void {
    this.pagedNotifications = this.notifications.slice(0, this.pageSize);
    this.paginator.firstPage();
    this.fromNow = moment(new Date()).fromNow();
  }

  pageChangeEvent(event: PageEvent) {
    const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.pagedNotifications = this.notifications.slice(offset).slice(0, event.pageSize);
    this.pageSize = event.pageSize;
  }

  notificationClicked(notification: any) {
    notification.seen = true;
  }

}
