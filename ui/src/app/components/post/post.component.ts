import { Component, Input, OnInit } from '@angular/core';
import { CommentVM } from '@models/comment-vm.model';
import { PostVM } from '@models/post-vm.model';
import { RenderedMedia } from '@models/rendered-media.model';
import { AuthService } from '@services/auth.service';
import { CommentService } from '@services/comment.service';
import { EnvironmentService } from '@services/environment.service';
import { MediaService } from '@services/media/media.service';
import { Constants } from '@util/constants';
import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() public set post(v: PostVM) {
    this._post = v;
    this.initData();
  }
  public get post(): PostVM {
    return this._post;
  }

  public fromNow: string;
  public commentsExpanded = false;
  public liked = false;
  public disliked = false;
  public renderedMedia: RenderedMedia;
  public youtubeUrl: string;
  public comments: CommentVM[] = [];
  public score = 0;

  private _post: PostVM;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private mediaService: MediaService,
    private commentService: CommentService,
  ) { }

  public ngOnInit() {
  }

  async initData() {
    if (!this._post) { return; }
    this.fromNow = moment(this._post.createdOn).fromNow();

    if (this._post.filePath) {
      this.mediaService.readFileFromUrl(this._post.filePath)
        .subscribe(
          async (file: File) => {
            this.renderedMedia = await this.mediaService.renderMedia([file]);
          }
        );
    }

    const execArray = Constants.YOUTUBE_URL_REGEX.exec(this._post.text);

    if (execArray) {
      this.youtubeUrl = execArray[0];
    }
    else {
      this.youtubeUrl = null;
    }
  }

  public like() {
    this.liked = !this.liked;
    if (this.liked) {
      this.disliked = false;
      //this.post.reactions.push({});
    } else {
      //this.post.reactions.pop();
    }
  }

  public dislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      this.liked = false;
      //this.post.reactions.pop();
    } else {
      //this.post.reactions.push({});
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

  urlToClipboard() {
    return `${location.origin}/posts/${this.post.id}`;
  }

  commentCreated(comment: CommentVM) {
    this.comments.unshift(comment);
  }

}
