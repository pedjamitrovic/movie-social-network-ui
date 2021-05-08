import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { debounceTime, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { MessageVM } from '../../models/message-vm.model';
import { AuthService } from '../../services/auth.service';
import { SystemEntityVM } from '../../models/system-entity-vm.model';
import { SystemEntityService } from '../../services/system-entity.service';
import { ChatRoomService } from '../../services/chat-room.service';
import { ChatRoomVM } from '../../models/chat-room-vm.model';
import { EnvironmentService } from '../../services/environment.service';
import { Paging } from '../../models/paging.model';
import { PagedList } from '../../models/paged-list.model';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { SendMessageCommand } from '../../models/send-message-command.model';
import { SignalrService } from '../../services/signalr.service';

export enum ChatState {
  Initial = 'initial',
  NewChat = 'new-chat',
  ChatOpened = 'chat-opened',
}

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

  state: ChatState = ChatState.Initial;
  showEmojiPicker = false;

  chatRooms: ChatRoomVM[];
  activeChatRoom: ChatRoomVM;
  newChatRoom: ChatRoomVM;

  searchedSystemEntities: SystemEntityVM[];

  newChatForm = new FormGroup({ user: new FormControl() });
  newMessageForm = new FormGroup({ message: new FormControl() });

  messages: MessageVM[];
  paging: Paging;
  pagedMessages: PagedList<MessageVM>;

  constructor(
    public authService: AuthService,
    public systemEntityService: SystemEntityService,
    public breakpointObserver: BreakpointObserver,
    public cdr: ChangeDetectorRef,
    public chatRoomService: ChatRoomService,
    public environment: EnvironmentService,
    public userService: UserService,
    public groupService: GroupService,
    public signalrService: SignalrService,
  ) {

  }

  ngOnInit() {
    this.init();
    this.initListeners();
  }

  init() {
    this.getMyChatRooms();
    this.newChatForm.controls.user.valueChanges
      .pipe(
        startWith(''),
        tap(() => this.searchedSystemEntities = []),
        filter((v) => v),
        debounceTime(500),
        switchMap((v) => this.searchSysEntities(v))
      )
      .subscribe(
        (results) => {
          this.searchedSystemEntities = results;
          const selfIndex = this.searchedSystemEntities.findIndex(e => e.id === this.authService.activeSystemEntityValue.id);
          if (selfIndex !== -1) this.searchedSystemEntities.splice(selfIndex, 1);
        }
      );
  }

  initListeners() {
    this.signalrService.receiveMessage
      .pipe(filter((m => !!m)))
      .subscribe(
        (m: MessageVM) => {
          const chatRoom = this.chatRooms.find((cr) => cr.id === m.chatRoomId);
          if (chatRoom) {
            chatRoom.newestMessage = m;
          } else {
            // Handle non existing chat room
          }
          if (this.activeChatRoom === chatRoom) {
            this.messages.push(m);
            this.scrollChatToBottom();
          }
        }
      );
  }

  getMyChatRooms() {
    this.chatRoomService.getMyChatRooms({ pageSize: 10000 })
      .subscribe(
        (e) => {
          this.chatRooms = e.items;
          this.setActiveChatRoom(this.chatRooms[0]);
        }
      );
  }

  setActiveChatRoom(chatRoom: ChatRoomVM) {
    if (this.activeChatRoom === chatRoom) {
      this.state = ChatState.Initial;
      this.activeChatRoom = null;
    } else {
      this.state = ChatState.ChatOpened;
      this.activeChatRoom = chatRoom;
      this.initChatRoom();
      this.scrollChatToBottom();
    }
    this.chatRooms = this.chatRooms.filter((cr) => cr.id);
  }

  createNewChat() {
    this.state = ChatState.NewChat;

    this.activeChatRoom = this.newChatRoom = { members: [] };
    this.newChatForm.controls.user.setValue('');

    this.cdr.detectChanges();
    this.newChatInput.nativeElement.focus();

    this.chatRooms = this.chatRooms.filter((cr) => cr.id);
  }

  userOptionSelected() {
    this.newChatRoom.members[0] = this.newChatForm.controls.user.value;

    const existingChatRoom = this.chatRooms.find((cr) => cr.members[0]?.id === this.newChatRoom.members[0]);

    if (existingChatRoom) {
      this.activeChatRoom = existingChatRoom;
    } else {
      this.chatRooms.unshift(this.newChatRoom);
    }

    this.state = ChatState.ChatOpened;
    this.initChatRoom();
    this.scrollChatToBottom();
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
      this.sendMessage();
    }
  }

  sendMessage() {
    if (!this.newMessageForm.controls.message.value) { return; }

    const command: SendMessageCommand = {
      text: this.newMessageForm.controls.message.value
    }

    if (!this.activeChatRoom.id) {
      console.log('chat not exists');
      this.chatRoomService.create([this.authService.activeSystemEntityValue.id, this.activeChatRoom.members[0].id]).subscribe(
        (chatRoomVM: ChatRoomVM) => {
          this.activeChatRoom = chatRoomVM;
          this.initChatRoom();
          this.chatRoomService.sendMessage(command);
          this.newMessageForm.controls.message.setValue('');
          this.scrollChatToBottom();
        }
      );
    } else {
      console.log('chat exists');
      command.chatRoomId = this.activeChatRoom.id;
      this.chatRoomService.sendMessage(command);
      this.newMessageForm.controls.message.setValue('');
      this.scrollChatToBottom();
    }
  }

  onScrolledUp() {
    this.getMessages();
  }

  initChatRoom() {
    this.messages = [];
    this.paging = new Paging();
    this.pagedMessages = null;
    this.getMessages();
  }

  getMessages() {
    if (!this.activeChatRoom.id) { return; }
    if (this.pagedMessages && this.paging.pageNumber > this.pagedMessages.totalPages) { return; }

    const queryParams: any = {
      ...this.paging
    };

    this.chatRoomService.getMessages(this.activeChatRoom.id, queryParams).subscribe(
      (pagedList) => {
        this.messages.unshift(...pagedList.items.reverse());
        if (!this.pagedMessages) this.scrollChatToBottom();
        this.pagedMessages = pagedList;
        this.paging.pageNumber = this.pagedMessages.page + 1;
      }
    );
  }

  searchSysEntities(q: string) {
    return forkJoin(
      [
        this.userService.getList({ q }),
        this.groupService.getList({ q }),
      ]
    ).pipe(
      map(
        ([pagedUsers, pagedGroups]) => [...pagedUsers.items, ...pagedGroups.items]
      )
    );
  }

  scrollChatToBottom() {
    this.cdr.detectChanges();
    const div = this.messageHistoryDiv?.nativeElement as HTMLDivElement;
    console.log(this.messageHistoryDiv);
    if (div) {
      div.scrollBy({ top: div.scrollHeight, behavior: 'smooth' });
    }
  }
}
