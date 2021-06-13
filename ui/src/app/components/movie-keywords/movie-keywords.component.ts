import { Component, Input, OnInit } from '@angular/core';
import { Keyword } from '../../models/tmdb/keyword.model';

@Component({
  selector: 'app-movie-keywords',
  templateUrl: './movie-keywords.component.html',
  styleUrls: ['./movie-keywords.component.scss']
})
export class MovieKeywordsComponent implements OnInit {
  @Input() keywords: Keyword[];

  constructor() { }

  ngOnInit(): void {
  }

}
