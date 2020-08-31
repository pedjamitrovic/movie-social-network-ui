import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from '@services/chat/chat.service';
import { Message } from '@models/message.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  title = 'Angular Chatroom';
  message$: Observable<Message[]>;
  userForm: FormGroup;
  messageForm: FormGroup;

  constructor(
    public chatService: ChatService
  ) {

  }

  ngOnInit() {
    this.messageForm = new FormGroup({
      message: new FormControl('')
    });
    this.userForm = new FormGroup({
      username: new FormControl('')
    });
    this.message$ = this.chatService.getMessages();
  }

  sendMessage() {
    const text = this.messageForm.controls.message.value;
    const timestamp = (new Date()).toISOString();
    this.chatService.sendMessage({ from: 'John', channel: 'Peter', text, timestamp });

    this.messageForm.controls.message.setValue('');
    this.message$ = this.chatService.getMessages();
  }
}
