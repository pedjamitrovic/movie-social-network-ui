import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.scss']
})
export class UserRatingComponent implements OnInit {
  @Input() value: number;
  @Output() valueChanged = new EventEmitter<{ oldValue: number, newValue: number }>();

  constructor() { }

  ngOnInit() { }

  onRate(event: { oldValue: number, newValue: number }) {
    this.valueChanged.emit(event);
  }

}
