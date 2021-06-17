import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Movie } from '@models/tmdb/movie.model';
import { PagedList } from '@models/tmdb/paged-list.model';
import { MovieService } from '@services/movie.service';

@Component({
  selector: 'app-movies-trending',
  templateUrl: './movies-trending.component.html',
  styleUrls: ['./movies-trending.component.scss']
})
export class MoviesTrendingComponent implements OnInit {
  movies: PagedList<Movie>;
  timeWindow = new FormControl('day');

  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.timeWindow.valueChanges.subscribe(
      (timeWindow) => {
        if (timeWindow) {
          this.getTrending();
        }
      }
    );
    this.getTrending();
  }

  getTrending() {
    if (!this.timeWindow.value) { return; }
    this.movieService.getTrendingMovies(this.timeWindow.value).subscribe((movies) => this.movies = movies);
  }

}
