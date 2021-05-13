import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthService } from '@services/auth.service';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { EnvironmentService } from '@services/environment.service';
import { ChatRoomService } from '../../services/chat-room.service';
import { ChatRoomVM } from '../../models/chat-room-vm.model';
import { SignalrService } from '../../services/signalr.service';
import { MessageVM } from '../../models/message-vm.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
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
  chatRooms: ChatRoomVM[];
  unseenChatRoomCount: number;
  unsubscribe: Subject<void> = new Subject();

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    public breakpointObserver: BreakpointObserver,
    public chatRoomService: ChatRoomService,
    public signalrService: SignalrService,
  ) { }

  ngOnInit(): void {
    this.fromNow = moment(new Date()).fromNow();
    this.newNotificationCount = 3;
    this.authService.activeSystemEntity.subscribe(() => this.initData());
    this.initData();
    this.initListeners();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initData() {
    this.chatRoomService.getMyChatRooms({ pageSize: 10000 })
      .subscribe(
        (e) => {
          this.chatRooms = e.items;
          this.calculateUnseenChatRooms();
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
  }

  calculateUnseenChatRooms() {
    const unseenChatRooms = this.chatRooms.filter(
      (cr) => cr.newestMessage.senderId !== this.authService.activeSystemEntityValue.id && !cr.newestMessage.seen
    );
    console.log(unseenChatRooms);
    this.unseenChatRoomCount = unseenChatRooms?.length || 0;
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
    this.authService.switchFromGroup();
  }

  logout() {
    this.authService.logout();
  }
}
