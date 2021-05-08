import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedList } from '@models/paged-list.model';
import { ChatRoomVM } from '../models/chat-room-vm.model';
import { SendMessageCommand } from '../models/send-message-command.model';
import { MessageVM } from '../models/message-vm.model';
import { CommonHttpService } from './common-http.service';
import { EnvironmentService } from './environment.service';
import { SignalrService } from './signalr.service';

@Injectable({ providedIn: 'root' })
export class ChatRoomService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
    private signalrService: SignalrService
  ) {
    this.apiUrl = `${this.environment.apiUrl}/chatrooms`;
  }

  getMyChatRooms(queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<ChatRoomVM>>(`${this.apiUrl}`, { params });
  }

  create(memberIds: number[]) {
    return this.http.post<ChatRoomVM>(`${this.apiUrl}`, { memberIds });
  }

  getMessages(id: number, queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<MessageVM>>(`${this.apiUrl}/${id}/messages`, { params });
  }

  sendMessage(command: SendMessageCommand) {
    this.signalrService.sendMessage(command);
  }
}
