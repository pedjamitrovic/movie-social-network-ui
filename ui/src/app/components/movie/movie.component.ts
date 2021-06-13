import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Movie } from '../../models/tmdb/movie.model';
import { MovieService } from '../../services/movie.service';

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
    public movieService: MovieService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(
          (params) => {
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
