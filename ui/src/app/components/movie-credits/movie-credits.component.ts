import { Component, Input, OnInit } from '@angular/core';
import { Credit } from '@models/tmdb/credit.model';
import { Movie } from '@models/tmdb/movie.model';
import { MovieService } from '@services/movie.service';

@Component({
  selector: 'app-movie-credits',
  templateUrl: './movie-credits.component.html',
  styleUrls: ['./movie-credits.component.scss']
})
export class MovieCreditsComponent implements OnInit {
  @Input() movie: Movie;

  director: Credit;
  producer: Credit;
  actors: Credit[];

  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.movieService.getMovieCredits(this.movie.id).subscribe(
      (res) => {
        this.director = res.crew.find((c) => c.job === 'Director');
        this.producer = res.crew.find((c) => c.job === 'Producer');
        this.actors = res.cast.slice(0, 5);
      }
    );
  }

}
