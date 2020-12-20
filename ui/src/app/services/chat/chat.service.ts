import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '@models/message.model';
import { Chance } from 'chance';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chance = new Chance();

  constructor() { }

  getMessages(): Observable<Message[]> {
    const messages: Message[] = [];
    const messageCount = this.chance.integer({ min: 20, max: 50 });

    for (let i = 0; i < messageCount; ++i) {
      messages.push(this.generateMessage());
    }

    return of(messages);
  }

  generateMessage(): Message {
    const message: Message = {
      id: this.chance.guid(),
      from: this.chance.integer({ min: 0, max: 1 }).toString(),
      channel: this.chance.guid(),
      text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 3 }) }),
      createdOn: new Date(),
    };

    return message;
  }
}
