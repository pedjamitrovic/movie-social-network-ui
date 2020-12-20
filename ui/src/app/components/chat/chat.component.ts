import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
export class ChatComponent implements OnInit {
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
  state: 'initial' | 'new-chat' | 'chat-opened' = 'initial';

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    public breakpointObserver: BreakpointObserver,
    public cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    forkJoin(
      [
        this.userService.getUsers(),
        this.userService.getUsers(),
      ]
    )
      .subscribe(
        ([usersA, usersB]) => {
          this.historyUsers.push(...usersA);
          this.historyUsers.push(...usersB);
        }
      );

    this.fromNow = moment(new Date()).fromNow();
  }

  setActiveUser(user: User) {
    if (this.activeUser === user) {
      this.state = 'initial';
      this.activeUser = null;
    } else {
      this.state = 'chat-opened';
      this.chatService.getMessages().subscribe((res) => this.messages = res);
      this.activeUser = user;
      this.cdr.detectChanges();
      this.scrollChatToBottom();
    }
  }

  createNewChat() {
    this.state = 'new-chat';
    this.newChatForm.controls.user.setValue(null);
    this.newChat = { user: {} };
    this.activeUser = this.newChat.user;
    this.cdr.detectChanges();
    this.newChatInput.nativeElement.focus();
  }

  userOptionSelected() {
    this.newChat.user = this.newChatForm.controls.user.value;
    this.setActiveUser(this.newChat.user);

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
            createdOn: new Date()
          }
        );
        this.newMessageForm.controls.message.setValue('');
        this.cdr.detectChanges();
        this.scrollChatToBottom();
      }
    }
  }

  onScrolledUp() {
    this.chatService.getMessages().subscribe((res) => this.messages.unshift(...res));
  }

  scrollChatToBottom() {
    const div = this.messageHistoryDiv.nativeElement as HTMLDivElement;
    if (div) {
      div.scrollBy({ top: div.scrollHeight, behavior: 'smooth' });
    }
  }
}
