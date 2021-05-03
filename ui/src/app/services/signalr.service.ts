import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  apiUrl: string;
  connection: signalR.HubConnection;
  hubHelloMessage: BehaviorSubject<string> = new BehaviorSubject<string>(null);

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
              this.connection.invoke('SendMessage', 3, 'Ej sta ima');
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
      (message: string) => {
        this.hubHelloMessage.next(message);
      }
    );
  }
}
