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
  receiveMessage: BehaviorSubject<MessageVM> = new BehaviorSubject<MessageVM>(null);
  chatRoomCreated: BehaviorSubject<ChatRoomVM> = new BehaviorSubject<ChatRoomVM>(null);

  constructor(
    private environment: EnvironmentService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/chat`;
  }

  initiateSignalrConnection(bearerToken: string): Promise<any> {
    if (this.connection) {
      this.receiveMessage.next(null);
      this.receiveMessage.next(null);
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

  private setSignalrClientMethods(): void {
    this.connection.on(
      'ReceiveMessage',
      (messageVM: MessageVM) => {
        this.receiveMessage.next(messageVM);
        console.log(messageVM);
      }
    );
    this.connection.on(
      'ChatRoomCreated',
      (chatRoomVM: ChatRoomVM) => {
        this.chatRoomCreated.next(chatRoomVM);
        console.log(chatRoomVM);
      }
    );
  }
}
