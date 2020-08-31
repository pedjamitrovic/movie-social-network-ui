import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '@models/message.model';
import { GroupedMessage } from '@models/grouped-message';

const MESSAGE_MAX_DELAY = 1000 * 60 * 10; // 10 minutes

@Pipe({
  name: 'groupMessages',
  pure: false
})
export class GroupMessagesPipe implements PipeTransform {
  groupedMessages: GroupedMessage[];
  lastGroupedMessage: GroupedMessage;

  transform(value: Message[]): GroupedMessage[] {
    this.groupedMessages = [];
    value.forEach((m) => {
      if (this.lastGroupedMessage) {
        const mTimestamp = new Date(m.timestamp);
        const lgmTimestamp = new Date(this.lastGroupedMessage.timestamp);
        if (this.lastGroupedMessage.from === m.from && mTimestamp.getTime() - lgmTimestamp.getTime() < MESSAGE_MAX_DELAY) {
          this.lastGroupedMessage.texts.push(m.text);
        } else {
          this.addNewGroupedMessage(m);
        }
      } else {
        this.addNewGroupedMessage(m);
      }
    });
    return this.groupedMessages;
  }

  public addNewGroupedMessage(m: Message) {
    const groupedMessage: GroupedMessage = { from: m.from, channel: m.channel, texts: [m.text], timestamp: m.timestamp };
    this.groupedMessages.push(groupedMessage);
    this.lastGroupedMessage = groupedMessage;
  }

}
