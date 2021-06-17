import { Component, OnInit } from '@angular/core';
import { Movie } from '@models/tmdb/movie.model';
import { PagedList } from '@models/tmdb/paged-list.model';
import { MovieService } from '@services/movie.service';

@Component({
  selector: 'app-movies-popular',
  templateUrl: './movies-popular.component.html',
  styleUrls: ['./movies-popular.component.scss']
})
export class MoviesPopularComponent implements OnInit {
  movies: PagedList<Movie>;

  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe((movies) => this.movies = movies);
  }

}
