import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Keyword } from '../../models/tmdb/keyword.model';
import { Movie } from '../../models/tmdb/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-production',
  templateUrl: './movie-production.component.html',
  styleUrls: ['./movie-production.component.scss']
})
export class MovieProductionComponent implements OnInit, OnChanges {
  @Input() movie: Movie;
  keywords: Keyword[];

  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movie?.currentValue) {
      this.movieService.getMovieKeywords(this.movie.id).subscribe((keywords) => this.keywords = keywords);
    }
  }


}
