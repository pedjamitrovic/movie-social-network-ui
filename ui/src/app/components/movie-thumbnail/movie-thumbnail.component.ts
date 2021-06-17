import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '@models/tmdb/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-thumbnail',
  templateUrl: './movie-thumbnail.component.html',
  styleUrls: ['./movie-thumbnail.component.scss']
})
export class MovieThumbnailComponent implements OnInit {
  @Input() movie: Movie;

  constructor(
    public movieService: MovieService,
  ) { }

  ngOnInit() { }

}
