import { Component, Input, OnInit } from '@angular/core';
import { CountUpOptions } from 'countup.js';

@Component({
  selector: 'app-movie-rating',
  templateUrl: './movie-rating.component.html',
  styleUrls: ['./movie-rating.component.scss']
})
export class MovieRatingComponent implements OnInit {
  @Input() rating: number;

  options: CountUpOptions = {
    decimalPlaces: 1,
    separator: '.'
  };

  constructor() { }

  ngOnInit() { }

}
