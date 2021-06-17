import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCommentCommand } from '@models/request/create-comment-command.model';
import { CommentVM } from '@models/response/comment-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  apiUrl = `${this.environment.apiUrl}/comments`;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
  }

  getList(queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<CommentVM>>(`${this.apiUrl}`, { params });
  }

  getById(id: number) {
    return this.http.get<CommentVM>(`${this.apiUrl}/${id}`);
  }

  create(command: CreateCommentCommand) {
    return this.http.post<CommentVM>(`${this.apiUrl}`, command);
  }
}
