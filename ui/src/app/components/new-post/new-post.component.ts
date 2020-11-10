import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NewPostCommand } from '@models/new-post-command.model';
import { Post } from '@models/post.model';
import { RenderedMedia } from '@models/rendered-media.model';
import { User } from '@models/user.model';
import { MediaService } from '@services/media/media.service';
import { PostService } from '@services/post/post.service';
import { UserService } from '@services/user/user.service';
import { Constants } from '@util/constants';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  @Output() public postCreated = new EventEmitter<Post>();

  public user: User;
  public command: NewPostCommand = new NewPostCommand();
  public renderedMedia: RenderedMedia;
  public youtubeUrl: string;

  @ViewChild('mediaInput') public mediaInput: ElementRef;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private mediaService: MediaService,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.generateUser();
  }

  public actionActivated(action: string) {
    switch (action) {
      case 'addMedia':
        this.addMedia();
        break;
      case 'dislike':
        // this.dislike();
        break;
      case 'post':
        this.createPost();
        break;
      default:
        break;
    }
  }

  public createPost() {
    if (!this.command.text && !this.command.media) return;
    const post = this.postService.generatePost();
    post.createdOn = new Date();
    post.text = this.command.text;
    post.user = this.user;
    post.media = this.command.media;
    this.postCreated.emit(post);
    this.reset();
  }

  public addMedia() {
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;
    mediaInput.click();
  }

  async addFiles() {
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;

    if (mediaInput?.files?.length === 0) { return; }

    this.command.media = Array.from(mediaInput.files);

    this.renderedMedia = await this.mediaService.renderMedia(this.command.media);

    mediaInput.value = null;
  }

  public onTextChange(value: string) {
    this.command.text = value;

    const execArray = Constants.YOUTUBE_URL_REGEX.exec(value);

    if (execArray) {
      this.youtubeUrl = execArray[0];
    }
    else {
      this.youtubeUrl = null;
    }
  }

  public reset() {
    this.renderedMedia = null;
    this.youtubeUrl = null;
    this.command = new NewPostCommand();
  }

}
