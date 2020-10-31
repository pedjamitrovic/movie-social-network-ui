import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comment-actions',
  templateUrl: './comment-actions.component.html',
  styleUrls: ['./comment-actions.component.scss']
})
export class CommentActionsComponent implements OnInit {
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
