import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendMessageCommand } from '@models/request/send-message-command.model';
import { ChatRoomVM } from '@models/response/chat-room-vm.model';
import { MessageVM } from '@models/response/message-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';
import { SignalrService } from '@services/signalr.service';

@Injectable({ providedIn: 'root' })
export class ChatRoomService {
  apiUrl = `${this.environment.apiUrl}/chatrooms`

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
    private signalrService: SignalrService
  ) {
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
