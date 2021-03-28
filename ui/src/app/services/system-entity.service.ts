import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  changeImage(id: number, type: string, image: File) {
    const formData = new FormData();
    formData.append('file', image, image.name);
    return this.http.post(`${this.apiUrl}/${id}/image/${type}`, formData, { responseType: 'text' });
  }
}
