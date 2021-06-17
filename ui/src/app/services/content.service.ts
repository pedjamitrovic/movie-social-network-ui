import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReactionCommand } from '@models/request/create-reaction-command.model';
import { ReportCommand } from '@models/request/report-command.model';
import { ReactionVM } from '@models/response/reaction-vm.model';
import { EnvironmentService } from '@services/environment.service';

@Injectable({ providedIn: 'root' })
export class ContentService {
  apiUrl = `${this.environment.apiUrl}/contents`;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
  ) {
  }

  react(id: number, command: CreateReactionCommand) {
    return this.http.post<ReactionVM>(`${this.apiUrl}/${id}/reaction`, command);
  }

  report(id: number, command: ReportCommand) {
    return this.http.post(`${this.apiUrl}/${id}/report`, command);
  }
}
