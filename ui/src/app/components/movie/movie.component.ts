import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '@models/tmdb/movie.model';
import { MovieService } from '@services/movie.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MovieComponent implements OnInit {
  id: number;
  movie: Movie;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(
          (params) => {
            this.movie = null;
            this.id = params.id;
            return this.movieService.getMovieDetails(this.id);
          }
        )
      )
      .subscribe(
        (movie) => {
          this.movie = movie;
        },
        (err) => {
          this.router.navigate(['/not-found']);
        }
      );
  }

}
