import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from '@services/chat/chat.service';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { User } from '@models/user.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import * as moment from 'moment';
import { Message } from '@models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('newChatInput') newChatInput: ElementRef;
  @ViewChild('messageHistoryDiv') messageHistoryDiv: ElementRef;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  activeUser: User;
  historyUsers: User[] = [];
  fromNow: string;
  newChat = null;
  newChatForm = new FormGroup({ user: new FormControl() });
  newMessageForm = new FormGroup({ message: new FormControl(), user: new FormControl('0') });
  showEmojiPicker = false;
  messages: Message[] = [];

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    public breakpointObserver: BreakpointObserver,
    public cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    for (let i = 0; i < 30; ++i) {
      this.messages.unshift(
        {
          text: 'abc',
          from: this.newMessageForm.controls.user.value,
          timestamp: new Date()
        }
      );
    }

    forkJoin([this.userService.getUsers(), this.userService.getUsers()])
      .subscribe(
        ([usersA, usersB]) => {
          this.historyUsers.push(...usersA);
          this.historyUsers.push(...usersB);
          this.activeUser = this.historyUsers[0];
        }
      );

    this.fromNow = moment(new Date()).fromNow();
  }

  ngAfterViewInit() {
    this.scrollChatToBottom();
  }

  setActiveUser(user: User) {
    this.activeUser = user;
  }

  createNewChat() {
    this.newChatForm.controls.user.setValue(null);
    this.newChat = { user: {} };
    this.setActiveUser(this.newChat.user);
    this.cdr.detectChanges();
    this.newChatInput.nativeElement.focus();
  }

  userOptionSelected() {
    this.newChat.user = this.newChatForm.controls.user.value;
    this.activeUser = this.newChat.user;

    if (!this.historyUsers.includes(this.newChat.user)) {
      this.historyUsers.unshift(this.newChat.user);
    }

    this.newChat = null;
  }

  addEmoji(event: any) {
    this.newMessageForm.controls.message.setValue(this.newMessageForm.controls.message.value + event.emoji.native);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  newMessageKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.newMessageForm.controls.message.value) {
        this.messages.push(
          {
            text: this.newMessageForm.controls.message.value,
            from: this.newMessageForm.controls.user.value,
            timestamp: new Date()
          }
        );
        this.newMessageForm.controls.message.setValue('');
        this.cdr.detectChanges();
        this.scrollChatToBottom();
      }
    }
  }

  onScrolledUp() {
    for (let i = 0; i < 10; ++i) {
      this.messages.unshift(
        {
          text: 'abc',
          from: this.newMessageForm.controls.user.value,
          timestamp: new Date()
        }
      );
    }
  }

  scrollChatToBottom() {
    const div = this.messageHistoryDiv.nativeElement as HTMLDivElement;
    if (div) {
      div.scrollBy({ top: div.scrollHeight, behavior: 'smooth' });
    }
  }
}
