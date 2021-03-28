import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedList } from '@models/paged-list.model';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class SystemEntityService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/systementities`;
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
}
