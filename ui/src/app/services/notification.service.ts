import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedList } from '@models/paged-list.model';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { NotificationVM } from '../models/notification-vm.model';
import { CommonHttpService } from './common-http.service';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/notifications`;
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
                    n.routerLink = [n.sender.discriminator === 'User' ? 'users' : 'groups', n.sender.id.toString()];
                    break;
                  case 'comment':
                    n.routerLink = ['comments', JSON.parse(n.extended).commentId];
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
