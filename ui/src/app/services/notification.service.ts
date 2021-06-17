import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationVM } from '@models/response/notification-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  apiUrl = `${this.environment.apiUrl}/notifications`;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
  }

  getMyNotifications(queryParams?: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<NotificationVM>>(`${this.apiUrl}`, { params })
      .pipe(
        map(
          (pagedList) => {
            pagedList.items.forEach(
              (n) => {
                switch (n.type) {
                  case 'follow':
                    n.routerLink = [n.sender.discriminator === 'User' ? '/users' : '/groups', n.sender.id.toString()];
                    break;
                  case 'comment':
                    n.routerLink = ['/comments', JSON.parse(n.extended).commentId];
                    break;
                  default:
                    console.error(`Unknown notification type ${n.type}`);
                    break;
                }
                n.fromNow = moment(n.createdOn).fromNow();
              }
            );
            return pagedList;
          }
        )
      );
  }

  getMyUnseenNotificationCount() {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
