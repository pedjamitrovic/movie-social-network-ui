import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePostCommand } from '@models/create-post-command.model';
import { PostVM } from '@models/post-vm.model';
import { EnvironmentService } from './environment.service';
import { Chance } from 'chance';
import { PagedList } from '@models/paged-list.model';
import { Paging } from '@models/paging.model';
import { Sorting } from '@models/sorting.model';
import { CommonHttpService } from './common-http.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  chance = new Chance();
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

  protected parseParams(rawParams?: any): HttpParams {
    let params = new HttpParams();
    if (rawParams) {
      Object.keys(rawParams).forEach((key) => {
        params = params.set(key, rawParams[key]);
      });
    }
    return params;
  }
}
