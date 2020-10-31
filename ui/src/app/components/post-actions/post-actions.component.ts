import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-post-actions',
  templateUrl: './post-actions.component.html',
  styleUrls: ['./post-actions.component.scss']
})
export class PostActionsComponent implements OnInit {
  @Input() public liked = false;
  @Input() public disliked = false;

  @Output() public actionActivated = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public activate(action: string) {
    this.actionActivated.emit(action);
  }

}
