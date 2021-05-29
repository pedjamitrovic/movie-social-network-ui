import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReactionCommand } from '@models/create-reaction-command.model';
import { ReactionVM } from '@models/reaction-vm.model';
import { ReportCommand } from '../models/report-command.model';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class ContentService {
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/contents`;
  }

  react(id: number, command: CreateReactionCommand) {
    return this.http.post<ReactionVM>(`${this.apiUrl}/${id}/reaction`, command);
  }

  report(id: number, command: ReportCommand) {
    return this.http.post(`${this.apiUrl}/${id}/report`, command);
  }
}
