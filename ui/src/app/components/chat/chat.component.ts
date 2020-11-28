import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from '@services/chat/chat.service';
import { Message } from '@models/message.model';
import { Observable } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { User } from '@models/user.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  activeUser: User;
  title = 'Angular Chatroom';
  message$: Observable<Message[]>;
  userForm: FormGroup;
  messageForm: FormGroup;
  users: User[] = [];
  fromNow: string;
  newChat = null;

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    public breakpointObserver: BreakpointObserver,
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
    this.userService.getUsers().subscribe(users => this.users.push(...users));

    this.userService.getUsers().subscribe(users => this.users.push(...users));

    this.fromNow = moment(new Date()).fromNow();
  }

  sendMessage() {
    const text = this.messageForm.controls.message.value;
    const timestamp = (new Date()).toISOString();
    this.chatService.sendMessage({ from: 'John', channel: 'Peter', text, timestamp });

    this.messageForm.controls.message.setValue('');
    this.message$ = this.chatService.getMessages();
  }

  setActiveUser(user: User) {
    this.activeUser = user;
  }
}
