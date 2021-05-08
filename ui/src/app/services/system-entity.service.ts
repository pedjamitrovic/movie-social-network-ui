import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeDescriptionCommand } from '@models/change-description-command';
import { PagedList } from '@models/paged-list.model';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { CommonHttpService } from './common-http.service';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class SystemEntityService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/systementities`;
  }

  getList(queryParams: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<SystemEntityVM>>(`${this.apiUrl}`, { params });
  }

  getById(id: number) {
    return this.http.get<SystemEntityVM>(`${this.apiUrl}/${id}`);
  }

  getFollowers(id: number) {
    return this.http.get<PagedList<SystemEntityVM>>(`${this.apiUrl}/${id}/followers`);
  }

  getFollowing(id: number) {
    return this.http.get<PagedList<SystemEntityVM>>(`${this.apiUrl}/${id}/following`);
  }

  follow(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/follow`, {});
  }

  unfollow(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/unfollow`, {});
  }

  changeImage(id: number, type: string, image: File) {
    const formData = new FormData();
    formData.append('file', image, image.name);
    return this.http.post(`${this.apiUrl}/${id}/image/${type}`, formData, { responseType: 'text' });
  }

  changeDescription(id: number, command: ChangeDescriptionCommand) {
    return this.http.patch(`${this.apiUrl}/${id}/description`, command);
  }
}
