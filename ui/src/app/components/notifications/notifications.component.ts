import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Paging } from '@models/request/paging.model';
import { NotificationVM } from '@models/response/notification-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { EnvironmentService } from '@services/environment.service';
import { NotificationService } from '@services/notification.service';
import { SignalrService } from '@services/signalr.service';
import { Subject } from 'rxjs';
import { filter, finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  paging: Paging;
  pagedList: PagedList<NotificationVM>;
  loading = false;

  unsubscribe: Subject<void> = new Subject();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public environment: EnvironmentService,
    private notificationService: NotificationService,
    private signalrService: SignalrService,
  ) { }

  ngOnInit() {
    this.init();
    this.initListeners();
    this.loading = true;
    this.getNotifications();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  init() {
    this.paging = new Paging();
    this.pagedList = null;
  }

  initListeners() {
    this.signalrService.notificationSeen
      .pipe(
        takeUntil(this.unsubscribe),
        filter((n => !!n))
      )
      .subscribe(
        (n: NotificationVM) => {
          const notification = this.pagedList.items.find(e => e.id === n.id);
          notification.seen = true;
        }
      );
  }

  pageChangeEvent(event: PageEvent) {
    this.paging.pageNumber = event.pageIndex + 1;
    this.paging.pageSize = event.pageSize;
    if (event.previousPageIndex === event.pageIndex) {
      this.paginator.firstPage();
    }
    this.pageChange();
  }

  pageChange() {
    this.loading = true;
    this.getNotifications();
  }

  getNotifications() {
    const queryParams: any = {
      ...this.paging,
    };

    this.notificationService.getMyNotifications(queryParams)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (pagedList) => {
          this.pagedList = pagedList;
        },
      );
  }

  notificationClicked(notification: NotificationVM) {
    if (!notification || notification.seen) { return; }
    this.signalrService.setNotificationSeen(notification);
  }
}
