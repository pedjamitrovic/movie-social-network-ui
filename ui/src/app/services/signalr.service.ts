import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SendMessageCommand } from '@models/send-message-command.model';
import { BehaviorSubject } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { MessageVM } from '@models/message-vm.model';
import { ChatRoomVM } from '../models/chat-room-vm.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  apiUrl: string;
  connection: signalR.HubConnection;
  messageCreated: BehaviorSubject<MessageVM> = new BehaviorSubject<MessageVM>(null);
  chatRoomCreated: BehaviorSubject<ChatRoomVM> = new BehaviorSubject<ChatRoomVM>(null);
  messageSeen: BehaviorSubject<MessageVM> = new BehaviorSubject<MessageVM>(null);

  constructor(
    private environment: EnvironmentService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/chat`;
  }

  initiateSignalrConnection(bearerToken: string): Promise<any> {
    if (this.connection) {
      this.stopConnection();
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

  stopConnection() {
    this.messageCreated.next(null);
    this.chatRoomCreated.next(null);
    this.messageSeen.next(null);
    this.connection.stop();
  }

  sendMessage(command: SendMessageCommand) {
    this.connection.send('SendMessage', command);
  }

  setMessageSeen(messageId: number) {
    this.connection.send('SetMessageSeen', messageId);
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
  }
}
