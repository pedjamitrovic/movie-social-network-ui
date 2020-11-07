import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '@models/comment.model';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() public set comment(v: Comment) {
    this._comment = v;
    if (this._comment) {
      this.fromNow = moment(this._comment.createdOn).fromNow();
    }
  }
  public get comment() : Comment {
    return this._comment;
  }

  date = new Date();
  fromNow: string;
  public liked = false;
  public disliked = false;

  private _comment: Comment;

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
