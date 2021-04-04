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
  @Input() public set comment(v: CommentVM) {
    this._comment = v;
    if (this._comment) {
      this.fromNow = moment(this._comment.createdOn).fromNow();
    }
  }
  public get comment(): CommentVM {
    return this._comment;
  }

  date = new Date();
  fromNow: string;
  public liked = false;
  public disliked = false;
  public score = 0;

  private _comment: CommentVM;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  public like() {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
      //this.comment.reactions.push({});
    } else {
      //this.comment.reactions.pop();
    }
  }

  public dislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
      //this.comment.reactions.pop();
    } else {
      //this.comment.reactions.push({});
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

  urlToClipboard() {
    return `${location.origin}/comments/${this.comment.id}`;
  }

}
