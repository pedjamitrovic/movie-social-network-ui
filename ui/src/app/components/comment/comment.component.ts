import { Component, Input, OnInit } from '@angular/core';
import { CommentVM } from '@models/comment-vm.model';
import { AuthService } from '@services/auth.service';
import { EnvironmentService } from '@services/environment.service';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() set comment(v: CommentVM) {
    this._comment = v;
    if (this._comment) {
      this.fromNow = moment(this._comment.createdOn).fromNow();
    }
  }
  get comment(): CommentVM {
    return this._comment;
  }
  @Input() padded = false;

  date = new Date();
  fromNow: string;
  liked = false;
  disliked = false;
  score = 0;

  private _comment: CommentVM;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  like() {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
      //this.comment.reactions.push({});
    } else {
      //this.comment.reactions.pop();
    }
  }

  dislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
      //this.comment.reactions.pop();
    } else {
      //this.comment.reactions.push({});
    }
  }

  urlToClipboard() {
    return `${location.origin}/comments/${this.comment.id}`;
  }

}
