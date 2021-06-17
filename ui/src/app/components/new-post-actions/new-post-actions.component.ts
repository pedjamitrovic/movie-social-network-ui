import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-post-actions',
  templateUrl: './new-post-actions.component.html',
  styleUrls: ['./new-post-actions.component.scss']
})
export class NewPostActionsComponent implements OnInit {
  @Output() public actionActivated = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  activate(action: string) {
    this.actionActivated.emit(action);
  }
}
