import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { CreatePostCommand } from '@models/create-post-command.model';
import { PostVM } from '@models/post-vm.model';
import { RenderedMedia } from '@models/rendered-media.model';
import { AuthService } from '@services/auth.service';
import { EnvironmentService } from '@services/environment.service';
import { MediaService } from '@services/media.service';
import { PostService } from '@services/post.service';
import { Constants } from '@util/constants';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  @Output() public postCreated = new EventEmitter<PostVM>();

  public command: CreatePostCommand = { text: '', file: null };
  public renderedMedia: RenderedMedia;
  public youtubeUrl: string;
  public showEmojiPicker = false;

  @ViewChild('mediaInput') public mediaInput: ElementRef;

  constructor(
    public authService: AuthService,
    public environment: EnvironmentService,
    private postService: PostService,
    private mediaService: MediaService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  actionActivated(action: string) {
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

  createPost() {
    if (!this.command.text && !this.command.file) return;
    this.postService.create(this.command)
      .subscribe(
        (post: PostVM) => {
          this.postCreated.emit(post);
          this.reset();
        },
        () => {
          this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
            ErrorDialogComponent,
            {
              data: {
                text: 'Unable to create post, something unexpected happened'
              }
            }
          );
        }
      )
  }

  addMedia() {
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;
    mediaInput.click();
  }

  async addFiles() {
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;

    if (mediaInput?.files?.length === 0) { return; }

    this.command.file = Array.from(mediaInput.files)[0];

    this.renderedMedia = await this.mediaService.renderMedia([this.command.file]);

    mediaInput.value = null;
  }

  onTextChange(event: Event) {
    this.command.text = (event.target as HTMLTextAreaElement).value;

    const execArray = Constants.YOUTUBE_URL_REGEX.exec(this.command.text);

    if (execArray) {
      this.youtubeUrl = execArray[0];
    }
    else {
      this.youtubeUrl = null;
    }
  }

  reset() {
    this.renderedMedia = null;
    this.youtubeUrl = null;
    this.command = { text: '', file: null };
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    this.command.text += event.emoji.native;
  }

}
