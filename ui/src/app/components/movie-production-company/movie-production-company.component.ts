import { Component, Input, OnInit } from '@angular/core';
import { Company } from '@models/tmdb/company.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-production-company',
  templateUrl: './movie-production-company.component.html',
  styleUrls: ['./movie-production-company.component.scss']
})
export class MovieProductionCompanyComponent implements OnInit {
  @Input() company: Company;

  constructor(
    public movieService: MovieService,
  ) { }

  ngOnInit() { }

}
