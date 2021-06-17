import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedList } from '@models/response/paged-list.model';
import { UserVM } from '@models/response/user-vm.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  apiUrl = `${this.environment.apiUrl}/users`;

  constructor(
    private environment: EnvironmentService,
    private commonHttpService: CommonHttpService,
    private http: HttpClient,
  ) {
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
