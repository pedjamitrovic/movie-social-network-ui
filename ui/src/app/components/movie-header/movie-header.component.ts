import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Movie } from '@models/tmdb/movie.model';
import { MovieService } from '@services/movie.service';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-movie-header',
  templateUrl: './movie-header.component.html',
  styleUrls: ['./movie-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MovieHeaderComponent implements OnInit {
  @Input() movie: Movie;

  trailerUrl: string;
  rating: number;
  myRating: number;
  loading = true;
  isEditRatingOpened = false;

  constructor(
    public movieService: MovieService,
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    const apiCalls = [
      this.getVideos(),
      this.getMyRating(),
    ];

    forkJoin(apiCalls).subscribe(
      () => {
        this.calculateRating();
        this.loading = false;
      }
    );
  }

  getVideos() {
    return this.movieService.getMovieVideos(this.movie.id).pipe(
      tap(
        (videos) => {
          const trailer = videos.find((e) => e.site === 'YouTube' && e.type === 'Trailer');
          if (trailer) {
            this.trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
          }
        }
      )
    );
  }

  getMyRating() {
    return this.movieService.getMyMovieRating(this.movie.id).pipe(
      tap(
        (movieRatingVM) => {
          this.myRating = movieRatingVM.rating;
        }
      ),
      catchError(() => of(null))
    );
  }

  calculateRating() {
    if (this.myRating) {
      this.rating = ((this.movie.vote_average * this.movie.vote_count) + this.myRating) / (this.movie.vote_count + 1);
    } else {
      this.rating = this.movie.vote_average;
    }
  }

  toggleEditMyRating() {
    this.isEditRatingOpened = !this.isEditRatingOpened;
  }

  userRatingChanged(event: { oldValue: number, newValue: number }) {
    if (event.oldValue === event.newValue) {
      this.movieService.rateMovie(this.movie.id, { rating: null }).subscribe();
      this.myRating = null;
    } else {
      this.movieService.rateMovie(this.movie.id, { rating: event.newValue }).subscribe();
      this.myRating = event.newValue;
    }
    this.calculateRating();
    this.isEditRatingOpened = false;
  }

  @HostListener('document:mousewheel')
  onMouseWheel() {
    if (this.isEditRatingOpened) { this.isEditRatingOpened = false; }
  }

  @HostListener('document:touchmove')
  onTouchMove() {
    if (this.isEditRatingOpened) { this.isEditRatingOpened = false; }
  }

  onOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isEditRatingOpened = false;
    }
  }
}
