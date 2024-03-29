import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatState } from '@models/internal/chat-state.model';
import { Paging } from '@models/request/paging.model';
import { SendMessageCommand } from '@models/request/send-message-command.model';
import { ChatRoomVM } from '@models/response/chat-room-vm.model';
import { MessageVM } from '@models/response/message-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { SystemEntityVM } from '@models/response/system-entity-vm.model';
import { AuthService } from '@services/auth.service';
import { ChatRoomService } from '@services/chat-room.service';
import { EnvironmentService } from '@services/environment.service';
import { GroupService } from '@services/group.service';
import { SignalrService } from '@services/signalr.service';
import { UserService } from '@services/user.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, OnDestroy {
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
  loadingInitialMessages = false;

  unsubscribe: Subject<void> = new Subject();

  @ViewChild('newChatInput') newChatInput: ElementRef;
  @ViewChild('messageHistoryDiv') messageHistoryDiv: ElementRef;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private chatRoomService: ChatRoomService,
    private userService: UserService,
    private groupService: GroupService,
    private signalrService: SignalrService,
  ) {

  }

  ngOnInit() {
    this.init();
    this.initListeners();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
    this.signalrService.messageCreated
      .pipe(
        takeUntil(this.unsubscribe),
        filter((m => !!m))
      )
      .subscribe(
        (m: MessageVM) => {
          const chatRoom = this.chatRooms.find((cr) => cr.id === m.chatRoomId);
          if (chatRoom) {
            chatRoom.newestMessage = m;
            this.moveChatRoomToTop(chatRoom.id);
          }
          if (this.activeChatRoom === chatRoom) {
            this.messages.push(m);
            this.scrollChatToBottom();
            this.setMessageSeen(chatRoom.newestMessage);
          }
        }
      );
    this.signalrService.chatRoomCreated
      .pipe(
        takeUntil(this.unsubscribe),
        filter((cr => !!cr))
      )
      .subscribe(
        (chatRoomVM: ChatRoomVM) => {
          this.removeSelf(chatRoomVM);
          const chatRoom = this.chatRooms.find((c) => c.id === chatRoomVM.id);
          if (!chatRoom) {
            this.chatRooms.unshift(chatRoomVM);
          }
        }
      );
    this.signalrService.messageSeen
      .pipe(
        takeUntil(this.unsubscribe),
        filter((m => !!m))
      )
      .subscribe(
        (m: MessageVM) => {
          const chatRoom = this.chatRooms.find((cr) => cr.id === m.chatRoomId);
          if (chatRoom) {
            chatRoom.newestMessage.seen = true;

            if (this.activeChatRoom === chatRoom) {
              this.messages.forEach((e) => e.seen = true);
            }
          }
        }
      );
  }

  getMyChatRooms() {
    this.chatRoomService.getMyChatRooms({ pageSize: 10000 })
      .subscribe(
        (e) => {
          this.chatRooms = e.items;
          this.chatRooms.forEach((cr) => this.removeSelf(cr));
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

    const existingChatRoom = this.chatRooms.find((cr) => cr.members[0]?.id === this.newChatRoom.members[0].id);

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
      this.chatRoomService.create([this.activeChatRoom.members[0].id]).subscribe(
        (chatRoomVM: ChatRoomVM) => {
          this.removeSelf(chatRoomVM);
          const activeIndex = this.chatRooms.findIndex(e => e === this.activeChatRoom);
          if (activeIndex !== -1) {
            this.chatRooms[activeIndex] = this.activeChatRoom = chatRoomVM;
          }
          this.initChatRoom();
          command.chatRoomId = chatRoomVM.id;
          this.chatRoomService.sendMessage(command);
          this.newMessageForm.controls.message.setValue('');
          this.scrollChatToBottom();
        }
      );
    } else {
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
    this.setMessageSeen(this.activeChatRoom?.newestMessage);
  }

  getMessages() {
    if (!this.activeChatRoom.id) { return; }
    if (this.pagedMessages && this.paging.pageNumber > this.pagedMessages.totalPages) { return; }

    const queryParams: any = {
      ...this.paging
    };

    if (!this.pagedMessages) { this.loadingInitialMessages = true; }

    this.chatRoomService.getMessages(this.activeChatRoom.id, queryParams)
      .pipe(finalize(() => this.loadingInitialMessages = false))
      .subscribe(
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
    if (div) {
      div.scrollBy({ top: div.scrollHeight, behavior: 'smooth' });
    }
  }

  removeSelf(chatRoomVM: ChatRoomVM) {
    const selfIndex = chatRoomVM.members.findIndex((e) => e.id === this.authService.activeSystemEntityValue.id);
    if (selfIndex !== -1) {
      chatRoomVM.members.splice(selfIndex, 1);
    }
  }

  moveChatRoomToTop(chatRoomId: number) {
    const roomIndex = this.chatRooms.findIndex((e) => e.id === chatRoomId);
    if (roomIndex !== -1) {
      const items = this.chatRooms.splice(roomIndex, 1);
      this.chatRooms.unshift(...items);
    }
  }

  setMessageSeen(message: MessageVM) {
    if (
      message &&
      message.senderId !== this.authService.activeSystemEntityValue.id &&
      !message.seen
    ) {
      this.signalrService.setMessageSeen(message.id);
    }
  }
}
