import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { CreateMessageCommand } from '@models/create-message-command.model';
import { BehaviorSubject } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { MessageVM } from '@models/message-vm.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  apiUrl: string;
  connection: signalR.HubConnection;
  hubHelloMessage: BehaviorSubject<MessageVM> = new BehaviorSubject<MessageVM>(null);

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
          .configureLogging(signalR.LogLevel.Trace)
          .withUrl(this.apiUrl, { accessTokenFactory: () => bearerToken })
          .build();

        this.setSignalrClientMethods();

        this.connection
          .start()
          .then(
            () => {
              console.log(`SignalR connection success! connectionId: ${this.connection.connectionId}`);
              const command: CreateMessageCommand = {
                chatRoomId: 3,
                text: 'Zdravo'
              }
              this.connection.invoke('SendMessage', command);
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

  private setSignalrClientMethods(): void {
    this.connection.on(
      'ReceiveMessage',
      (messageVM: MessageVM) => {
        this.hubHelloMessage.next(messageVM);
        console.log(messageVM);
      }
    );
  }
}
