import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePostCommand } from '@models/request/create-post-command.model';
import { PagedList } from '@models/response/paged-list.model';
import { PostVM } from '@models/response/post-vm.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  apiUrl = `${this.environment.apiUrl}/posts`;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
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
