import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SendMessageCommand } from '@models/send-message-command.model';
import { EnvironmentService } from './environment.service';
import { MessageVM } from '@models/message-vm.model';
import { ChatRoomVM } from '../models/chat-room-vm.model';
import { Subject } from 'rxjs';
import { NotificationVM } from '../models/notification-vm.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  apiUrl: string;
  connection: signalR.HubConnection;
  messageCreated: Subject<MessageVM> = new Subject<MessageVM>();
  chatRoomCreated: Subject<ChatRoomVM> = new Subject<ChatRoomVM>();
  messageSeen: Subject<MessageVM> = new Subject<MessageVM>();
  newNotification: Subject<NotificationVM> = new Subject<NotificationVM>();

  constructor(
    private environment: EnvironmentService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/chat`;
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

  setNotificationSeen(notificationId: number) {
    this.connection.send('SetNotificationSeen', notificationId);
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
