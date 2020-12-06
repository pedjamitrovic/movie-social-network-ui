import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '@models/message.model';

// const MESSAGES: Message[] =
//   [
//     { from: 'John', channel: '1', text: 'Hi', timestamp: '2016-02-10T00:00:00Z' },
//     { from: 'John', channel: '1', text: 'I\'m John', timestamp: '2016-02-10T00:00:04Z' },
//     { from: 'John', channel: '1', text: 'Call me later', timestamp: '2016-02-10T00:01:00Z' },
//     { from: 'Peter', channel: '1', text: 'Will do', timestamp: '2016-02-11T00:01:00Z' },
//     { from: 'Peter', channel: '1', text: 'Bye :)', timestamp: '2016-02-11T02:00:00Z' },
//   ];

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  // getMessages(): Observable<Message[]> {
  //   return of(MESSAGES);
  // }

  // sendMessage(message: Message) {
  //   MESSAGES.push(message);
  // }
}
