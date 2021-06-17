import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeDescriptionCommand } from '@models/request/change-description-command';
import { ReportCommand } from '@models/request/report-command.model';
import { ReviewReportCommand } from '@models/request/review-report-command.model';
import { PagedList } from '@models/response/paged-list.model';
import { ReportedDetails } from '@models/response/reported-details.model';
import { SystemEntityVM } from '@models/response/system-entity-vm.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';

@Injectable({ providedIn: 'root' })
export class SystemEntityService {
  apiUrl = `${this.environment.apiUrl}/systementities`;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
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

  report(id: number, command: ReportCommand) {
    return this.http.post(`${this.apiUrl}/${id}/report`, command);
  }

  getBannable(queryParams?: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<ReportedDetails>>(`${this.apiUrl}/bannable`, { params });
  }

  resolveReport(id: number, command: ReviewReportCommand) {
    return this.http.post(`${this.apiUrl}/${id}/review-report`, command);
  }
}
