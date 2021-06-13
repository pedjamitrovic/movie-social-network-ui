import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../models/tmdb/movie.model';

@Component({
  selector: 'app-movie-production-info',
  templateUrl: './movie-production-info.component.html',
  styleUrls: ['./movie-production-info.component.scss']
})
export class MovieProductionInfoComponent implements OnInit {
  @Input() movie: Movie;

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
