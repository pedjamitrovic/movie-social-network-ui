import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedList } from '@models/paged-list.model';
import { UserVM } from '@models/user-vm.model';
import { CommonHttpService } from './common-http.service';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private commonHttpService: CommonHttpService,
    private http: HttpClient,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/users`;
  }

  getList(queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<UserVM>>(`${this.apiUrl}`, { params });
  }

  getById(id: number) {
    return this.http.get<UserVM>(`${this.apiUrl}/${id}`);
  }
}
