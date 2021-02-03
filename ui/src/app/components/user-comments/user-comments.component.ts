import { Component, OnInit } from '@angular/core';
import { Comment } from '@models/comment.model';
import { CommentService } from '@services/comment/comment.service';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.scss']
})
export class UserCommentsComponent implements OnInit {
  comments: Comment[] = [];

  constructor(public commentService: CommentService) { }

  ngOnInit() {
    this.getPosts();
  }

  onScrollDown() {
    this.getPosts();
  }

  getPosts() {
    this.commentService.getComments().subscribe(
      (comments: Comment[]) => {
        this.comments.push(...comments);
      }
    );
  }
}
