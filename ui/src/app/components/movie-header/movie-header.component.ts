import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StarRatingComponent } from 'ng-starrating';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Movie } from '../../models/tmdb/movie.model';
import { MovieService } from '../../services/movie.service';

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
    return this.movieService.getMyRating(this.movie.id).pipe(
      tap(
        (myRating) => {
          this.myRating = myRating;
        }
      )
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
      this.myRating = null;
    } else {
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
}
