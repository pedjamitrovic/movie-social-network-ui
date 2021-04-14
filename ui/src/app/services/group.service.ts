import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupVM } from '@models/group-vm.model';
import { PagedList } from '@models/paged-list.model';
import { CommonHttpService } from './common-http.service';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class GroupService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private commonHttpService: CommonHttpService,
    private http: HttpClient,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/groups`;
  }

  getList(queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<GroupVM>>(`${this.apiUrl}`, { params });
  }

  getById(id: number) {
    return this.http.get<GroupVM>(`${this.apiUrl}/${id}`);
  }
}
