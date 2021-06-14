import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../models/tmdb/movie.model';

@Component({
  selector: 'app-movie-rating',
  templateUrl: './movie-rating.component.html',
  styleUrls: ['./movie-rating.component.scss']
})
export class MovieRatingComponent implements OnInit {
  @Input() movie: Movie;

  constructor() { }

  ngOnInit(): void {
  }

}
