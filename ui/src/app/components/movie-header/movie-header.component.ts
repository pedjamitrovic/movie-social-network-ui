import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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

  constructor(
    public movieService: MovieService,
  ) { }

  ngOnInit() {
    this.movieService.getMovieVideos(this.movie.id).subscribe(
      (videos) => {
        const trailer = videos.find((e) => e.site === 'YouTube' && e.type === 'Trailer');
        if (trailer) {
          this.trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        }
      }
    );
  }

}
