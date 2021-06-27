import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '@models/tmdb/configuration.model';
import { Movie } from '@models/tmdb/movie.model';
import { PagedList } from '@models/tmdb/paged-list.model';
import { CommonHttpService } from '@services/common-http.service';
import { EnvironmentService } from '@services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  apiUrl = `${this.environment.apiUrl}/recommendations`;
  configuration: Configuration;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
  }

  getRecommendations(queryParams?: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<Movie>>(`${this.apiUrl}`, { params });
  }
}
