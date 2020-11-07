import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@models/post.model';
import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() public set post(v: Post) {
    this._post = v;
    if (this._post) {
      this.fromNow = moment(this._post.createdOn).fromNow();
    }
  }
  public get post() : Post {
    return this._post;
  }

  public fromNow: string;
  public commentsExpanded = false;
  public liked = false;
  public disliked = false;

  private _post: Post;

  constructor(
    public ar: ActivatedRoute
  ) { }

  public ngOnInit() {
    this.ar.params.subscribe(() => {

    });
  }

  public like() {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
      this.post.reactions.push({});
    } else {
      this.post.reactions.pop();
    }
  }

  public dislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
      this.post.reactions.pop();
    } else {
      this.post.reactions.push({});
    }
  }

  public toggleComments() {
    this.commentsExpanded = !this.commentsExpanded;
  }

  public actionActivated(action: string) {
    switch (action) {
      case 'like':
        this.like();
        break;
      case 'dislike':
        this.dislike();
        break;
      case 'comment':
        this.toggleComments();
        break;
      default:
        break;
    }
  }

  public urlToClipboard() {
    return `${location.origin}/posts/${this.post.id}`;
  }

}
