import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-imdb',
  templateUrl: './imdb.component.html',
  styleUrls: ['./imdb.component.scss']
})
export class ImdbComponent implements OnInit {
  @Input() imdbId: string;
  @Input() movieTitle: string;

  constructor() { }

  ngOnInit(): void {
  }

}
