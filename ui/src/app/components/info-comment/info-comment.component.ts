import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '@models/comment.model';
import { Post } from '@models/post.model';

@Component({
  selector: 'app-info-comment',
  templateUrl: './info-comment.component.html',
  styleUrls: ['./info-comment.component.scss']
})
export class InfoCommentComponent implements OnInit {
  @Input() comment: Comment;

  constructor() { }

  ngOnInit(): void {
  }

}
