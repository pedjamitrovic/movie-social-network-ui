import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from '@models/tmdb/movie.model';
import { PagedList } from '@models/tmdb/paged-list.model';
import { RecommendationService } from '@services/recommendation.service';
import { Paging } from '@models/request/paging.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-movies-recommended',
  templateUrl: './movies-recommended.component.html',
  styleUrls: ['./movies-recommended.component.scss']
})
export class MoviesRecommendedComponent implements OnInit {
  @Input() disableLoadMore: boolean;
  @Output() loaded = new EventEmitter<boolean>();

  pagedList: PagedList<Movie>;
  movies: Movie[] = [];
  loading = true;
  paging: Paging = new Paging();

  constructor(
    private recommendationService: RecommendationService,
  ) { }

  ngOnInit() {
    this.paging.pageSize = 20;
    this.getRecommendations();
  }

  getRecommendations() {
    if (this.pagedList && this.pagedList.page > this.pagedList.total_pages) { return; }

    const queryParams: any = {
      ...this.paging
    };

    this.loading = true;

    this.recommendationService.getRecommendations(queryParams)
      .pipe(
        finalize(
          () => this.loading = false
        )
      )
      .subscribe(
        (pagedList) => {
          this.loading = false;
          this.pagedList = pagedList;
          this.movies.push(...pagedList.results);
          this.paging.pageNumber = this.pagedList.page + 1;
        }
      );
  }

}
