import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePostCommand } from '@models/create-post-command.model';
import { PagedList } from '@models/paged-list.model';
import { PostVM } from '@models/post-vm.model';
import { CommonHttpService } from './common-http.service';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/posts`;
  }

  getList(queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<PostVM>>(`${this.apiUrl}`, { params });
  }

  getById(id: number) {
    return this.http.get<PostVM>(`${this.apiUrl}/${id}`);
  }

  create(command: CreatePostCommand) {
    const formData = new FormData();
    if (command.file) {
      formData.append('file', command.file, command.file.name);
    }
    if (command.text) {
      formData.append('text', command.text);
    }
    return this.http.post<PostVM>(`${this.apiUrl}`, formData);
  }
}
