import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Movie } from '@models/tmdb/movie.model';
import { PagedList } from '@models/tmdb/paged-list.model';
import { MovieService } from '@services/movie.service';

@Component({
  selector: 'app-movies-similar',
  templateUrl: './movies-similar.component.html',
  styleUrls: ['./movies-similar.component.scss']
})
export class MoviesSimilarComponent implements OnInit, OnChanges {
  @Input() movie: Movie;

  movies: PagedList<Movie>;

  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movie.currentValue) {
      this.movieService.getSimilarMovies(this.movie.id).subscribe((movies) => this.movies = movies);
    }
  }
}
