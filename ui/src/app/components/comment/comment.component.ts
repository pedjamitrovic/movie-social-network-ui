import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '@models/comment.model';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  date = new Date();
  commentDate = moment([2020, 8, 29]).fromNow();
  public liked = false;
  public disliked = false;

  constructor() { }

  ngOnInit(): void {
  }

  public like() {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
      this.comment.reactions.push({});
    } else {
      this.comment.reactions.pop();
    }
  }

  public dislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
      this.comment.reactions.pop();
    } else {
      this.comment.reactions.push({});
    }
  }

  public actionActivated(action: string) {
    switch (action) {
      case 'like':
        this.like();
        break;
      case 'dislike':
        this.dislike();
        break;
      default:
        break;
    }
  }

}
