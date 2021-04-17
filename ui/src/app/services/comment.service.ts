import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentVM } from '@models/comment-vm.model';
import { CreateCommentCommand } from '@models/create-comment-command.model';
import { PagedList } from '@models/paged-list.model';
import { CommonHttpService } from './common-http.service';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/comments`;
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
