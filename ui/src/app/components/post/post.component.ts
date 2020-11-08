import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@models/post.model';
import { RenderedMedia } from '@models/rendered-media.model';
import { MediaService } from '@services/media/media.service';
import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() public set post(v: Post) {
    this._post = v;
    this.initData();
  }
  public get post(): Post {
    return this._post;
  }

  public fromNow: string;
  public commentsExpanded = false;
  public liked = false;
  public disliked = false;
  public renderedMedia: RenderedMedia;

  private _post: Post;

  constructor(
    private mediaService: MediaService,
  ) { }

  public ngOnInit() {
  }

  async initData() {
    if (!this._post) { return; }
    this.fromNow = moment(this._post.createdOn).fromNow();
    this.renderedMedia = await this.mediaService.renderMedia(this._post.media);
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
