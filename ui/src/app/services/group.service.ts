import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateGroupCommand } from '@models/request/create-group-command.model';
import { GroupVM } from '@models/response/group-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';

@Injectable({ providedIn: 'root' })
export class GroupService {
  apiUrl = `${this.environment.apiUrl}/groups`;

  constructor(
    private environment: EnvironmentService,
    private commonHttpService: CommonHttpService,
    private http: HttpClient,
  ) {
  }

  getList(queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<GroupVM>>(`${this.apiUrl}`, { params });
  }

  getById(id: number) {
    return this.http.get<GroupVM>(`${this.apiUrl}/${id}`);
  }

  create(command: CreateGroupCommand) {
    return this.http.post<GroupVM>(`${this.apiUrl}`, command);
  }

}
