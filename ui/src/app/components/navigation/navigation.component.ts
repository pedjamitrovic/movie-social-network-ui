import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { EnvironmentService } from '@services/environment.service';
import { ChatRoomService } from '../../services/chat-room.service';
import { ChatRoomVM } from '../../models/chat-room-vm.model';
import { SignalrService } from '../../services/signalr.service';
import { MessageVM } from '../../models/message-vm.model';
import { NotificationVM } from '../../models/notification-vm.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean>;
  showNotificationMenu = false;
  notifications: NotificationVM[];
  unseenNotificationCount: number;
  chatRooms: ChatRoomVM[];
  unseenChatRoomCount: number;
  unsubscribe: Subject<void> = new Subject();

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    public breakpointObserver: BreakpointObserver,
    public chatRoomService: ChatRoomService,
    public notificationService: NotificationService,
    public signalrService: SignalrService,
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.authService.activeSystemEntity.subscribe(() => this.initData());
    this.initListeners();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initData() {
    if (!this.authService.activeSystemEntityValue) { return; }
    this.chatRoomService.getMyChatRooms({ pageSize: 10000 })
      .subscribe(
        (e) => {
          this.chatRooms = e.items;
          this.calculateUnseenChatRooms();
        }
      );
    this.notificationService.getMyNotifications({ pageSize: 4 })
    .subscribe(
      (e) => {
        this.notifications = e.items;
        console.log(this.notifications);
      }
    );
    this.notificationService.getMyUnseenNotificationCount()
    .subscribe(
      (count) => {
        this.unseenNotificationCount = count;
        console.log(count);
      }
    );
  }

  initListeners() {
    this.signalrService.messageCreated
      .pipe(
        takeUntil(this.unsubscribe),
        filter((m => !!m))
      )
      .subscribe(
        (m: MessageVM) => {
          const chatRoom = this.chatRooms.find((cr) => cr.id === m.chatRoomId);
          if (chatRoom) {
            chatRoom.newestMessage = m;
          }
          this.calculateUnseenChatRooms();
        }
      );
    this.signalrService.chatRoomCreated
      .pipe(
        takeUntil(this.unsubscribe),
        filter((cr => !!cr))
      )
      .subscribe(
        (chatRoomVM: ChatRoomVM) => {
          const chatRoom = this.chatRooms.find((c) => c.id === chatRoomVM.id);
          if (!chatRoom) {
            this.chatRooms.unshift(chatRoomVM);
          }
          this.calculateUnseenChatRooms();
        }
      );
    this.signalrService.messageSeen
      .pipe(
        takeUntil(this.unsubscribe),
        filter((m => !!m))
      )
      .subscribe(
        (m: MessageVM) => {
          const chatRoom = this.chatRooms.find((cr) => cr.id === m.chatRoomId);
          if (chatRoom) {
            chatRoom.newestMessage.seen = true;
          }
          this.calculateUnseenChatRooms();
        }
      );
      this.signalrService.newNotification
        .pipe(
          takeUntil(this.unsubscribe),
          filter((n => !!n))
        )
        .subscribe(
          (n: NotificationVM) => {
            this.notifications.unshift(n);
            this.notifications.splice(this.notifications.length - 1, 1);
            this.unseenNotificationCount++;
          }
        );
  }

  calculateUnseenChatRooms() {
    const unseenChatRooms = this.chatRooms.filter(
      (cr) => cr.newestMessage.senderId !== this.authService.activeSystemEntityValue.id && !cr.newestMessage.seen
    );
    this.unseenChatRoomCount = unseenChatRooms?.length || 0;
  }

  toggleNotificationMenu() {
    this.showNotificationMenu = !this.showNotificationMenu;
  }

  notificationClicked(notification: NotificationVM) {
    if (!notification.seen) {
      notification.seen = true;
      this.unseenNotificationCount--;
      this.signalrService.setNotificationSeen(notification.id);
    }
  }

  switchContext() {
    this.authService.switchFromGroup();
  }

  logout() {
    this.authService.logout();
  }
}
