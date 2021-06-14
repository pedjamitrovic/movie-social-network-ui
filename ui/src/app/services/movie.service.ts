import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '@services/environment.service';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Configuration } from '../models/tmdb/configuration.model';
import { Credit } from '../models/tmdb/credit.model';
import { Keyword } from '../models/tmdb/keyword.model';
import { Movie } from '../models/tmdb/movie.model';
import { PagedList } from '../models/tmdb/paged-list.model';
import { Video } from '../models/tmdb/video.model';
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

  getMovieKeywords(id: number) {
    return this.http.get<{keywords: Keyword[]}>(`${this.apiUrl}/movie/${id}/keywords`).pipe(map((res) => res.keywords));
  }

  getMovieRecommendations(id: number) {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}/recommendations`);
  }

  getMovieCredits(id: number) {
    return this.http.get<{cast: Credit[], crew: Credit[]}>(`${this.apiUrl}/movie/${id}/credits`);
  }

  getSimilarMovies(id: number) {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}//similar`);
  }

  getMovieVideos(id: number) {
    return this.http.get<{results: Video[]}>(`${this.apiUrl}/movie/${id}/videos`).pipe(map((res) => res.results));
  }
}
