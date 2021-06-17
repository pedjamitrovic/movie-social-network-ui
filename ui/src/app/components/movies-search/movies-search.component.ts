import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Movie } from '@models/tmdb/movie.model';
import { PagedList } from '@models/tmdb/paged-list.model';
import { MovieService } from '@services/movie.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-movies-search',
  templateUrl: './movies-search.component.html',
  styleUrls: ['./movies-search.component.scss']
})
export class MoviesSearchComponent implements OnInit {
  movies: PagedList<Movie>;
  query = new FormControl();

  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.query.valueChanges
      .pipe(debounceTime(500))
      .subscribe(
        () => {
          this.search();
        }
      );
  }

  search() {
    if (!this.query.value) {
      this.movies = null;
      return;
    }
    this.movieService.searchMovies({ query: this.query.value })
      .subscribe(
        (movies) => {
          this.movies = movies;
          this.movies.results.sort((a, b) => b.vote_average - a.vote_average);
        }
      );
  }

}
