import { Component, Input, OnInit } from '@angular/core';
import { CommentVM } from '@models/comment-vm.model';
import { EnvironmentService } from '@services/environment.service';

@Component({
  selector: 'app-info-comment',
  templateUrl: './info-comment.component.html',
  styleUrls: ['./info-comment.component.scss']
})
export class InfoCommentComponent implements OnInit {
  @Input() comment: CommentVM;

  constructor(public environment: EnvironmentService) { }

  ngOnInit(): void {
  }

}
