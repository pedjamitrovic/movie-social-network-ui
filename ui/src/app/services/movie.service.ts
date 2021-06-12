import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '@services/environment.service';
import { tap } from 'rxjs/operators';
import { Configuration } from '../models/tmdb/configuration.model';
import { Movie } from '../models/tmdb/movie.model';
import { PagedList } from '../models/tmdb/paged-list.model';
import { CommonHttpService } from './common-http.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  apiUrl: string;
  configuration: Configuration;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private commonHttpService: CommonHttpService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/tmdb`;
  }

  initConfiguration() {
    return this.getConfiguration().pipe(tap((configuration) => this.configuration = configuration));
  }

  getConfiguration() {
    return this.http.get<Configuration>(`${this.apiUrl}/configuration`);
  }

  getMovieDetails(id: number) {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}`);
  }

  searchMovies(queryParams?: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<Movie>>(`${this.apiUrl}/search/movie`, { params });
  }

  getTrendingMovies(timeWindow: 'day' | 'week', queryParams?: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<Movie>>(`${this.apiUrl}/trending/movie/${timeWindow}`, { params });
  }

  getPopularMovies(queryParams?: any) {
    let params = new HttpParams();
    params = this.commonHttpService.parseParams(queryParams);
    return this.http.get<PagedList<Movie>>(`${this.apiUrl}/movie/popular`, { params });
  }
}
