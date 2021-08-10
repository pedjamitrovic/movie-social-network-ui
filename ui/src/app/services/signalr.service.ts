import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SendMessageCommand } from '@models/request/send-message-command.model';
import { ChatRoomVM } from '@models/response/chat-room-vm.model';
import { MessageVM } from '@models/response/message-vm.model';
import { NotificationVM } from '@models/response/notification-vm.model';
import { EnvironmentService } from '@services/environment.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  apiUrl = `${this.environment.apiUrl}/msn-hub`;

  messageCreated: Subject<MessageVM> = new Subject<MessageVM>();
  chatRoomCreated: Subject<ChatRoomVM> = new Subject<ChatRoomVM>();
  messageSeen: Subject<MessageVM> = new Subject<MessageVM>();
  newNotification: Subject<NotificationVM> = new Subject<NotificationVM>();
  notificationSeen: Subject<NotificationVM> = new Subject<NotificationVM>();

  connection: signalR.HubConnection;

  constructor(
    private environment: EnvironmentService,
  ) {
  }

  initiateSignalrConnection(bearerToken: string): Promise<any> {
    if (this.connection) {
      this.connection.stop();
    }

    return new Promise<void>(
      (resolve, reject) => {
        this.connection = new signalR.HubConnectionBuilder()
          .configureLogging(signalR.LogLevel.Information)
          .withUrl(this.apiUrl, { accessTokenFactory: () => bearerToken })
          .build();

        this.setSignalrClientMethods();

        this.connection
          .start()
          .then(
            () => {
              console.log(`SignalR connection success! connectionId: ${this.connection.connectionId}`);
              resolve();
            }
          )
          .catch(
            (error) => {
              console.log(`SignalR connection error: ${error}`);
              reject();
            }
          );
      }
    );
  }

  sendMessage(command: SendMessageCommand) {
    this.connection.send('SendMessage', command);
  }

  setMessageSeen(messageId: number) {
    this.connection.send('SetMessageSeen', messageId);
  }

  setNotificationSeen(notification: NotificationVM) {
    if (!notification || notification.seen) { return; }
    this.connection.send('SetNotificationSeen', notification.id);
    this.notificationSeen.next(notification);
  }

  private setSignalrClientMethods(): void {
    this.connection.on(
      'NotifyMessageCreated',
      (messageVM: MessageVM) => {
        this.messageCreated.next(messageVM);
        console.log('NotifyMessageCreated');
        console.log(messageVM);
      }
    );
    this.connection.on(
      'NotifyChatRoomCreated',
      (chatRoomVM: ChatRoomVM) => {
        this.chatRoomCreated.next(chatRoomVM);
        console.log('NotifyChatRoomCreated');
        console.log(chatRoomVM);
      }
    );
    this.connection.on(
      'NotifyMessageSeen',
      (messageVM: MessageVM) => {
        this.messageSeen.next(messageVM);
        console.log('NotifyMessageSeen');
        console.log(messageVM);
      }
    );
    this.connection.on(
      'NotifyNewNotification',
      (notificationVM: NotificationVM) => {
        this.messageSeen.next(notificationVM);
        console.log('NotifyNewNotification');
        console.log(notificationVM);
      }
    );
  }
}
