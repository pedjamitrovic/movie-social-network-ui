import { Component, Input, OnInit } from '@angular/core';
import { Credit } from '@models/tmdb/credit.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-credit',
  templateUrl: './movie-credit.component.html',
  styleUrls: ['./movie-credit.component.scss']
})
export class MovieCreditComponent implements OnInit {
  @Input() credit: Credit;
  @Input() job: string;

  constructor(
    public movieService: MovieService,
  ) { }

  ngOnInit() { }

}
