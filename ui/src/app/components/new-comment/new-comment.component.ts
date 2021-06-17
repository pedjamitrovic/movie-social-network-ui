import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { RenderedMedia } from '@models/internal/rendered-media.model';
import { CreateCommentCommand } from '@models/request/create-comment-command.model';
import { CommentVM } from '@models/response/comment-vm.model';
import { PostVM } from '@models/response/post-vm.model';
import { AuthService } from '@services/auth.service';
import { CommentService } from '@services/comment.service';
import { EnvironmentService } from '@services/environment.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss']
})
export class NewCommentComponent implements OnInit {
  @Input() public set post(v: PostVM) {
    this._post = v;
  }
  public get post(): PostVM {
    return this._post;
  }
  @Output() public commentCreated = new EventEmitter<CommentVM>();

  public command: CreateCommentCommand = { text: '' };
  public renderedMedia: RenderedMedia;
  public showEmojiPicker = false;
  private _post: PostVM;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private commentService: CommentService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() { }

  public createComment() {
    if (!this.command.text) return;

    this.command.postId = this.post.id;

    this.commentService.create(this.command)
      .subscribe(
        (comment: CommentVM) => {
          this.commentCreated.emit(comment);
          this.reset();
        },
        () => {
          this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
            ErrorDialogComponent,
            {
              data: {
                text: 'Unable to create comment, something unexpected happened'
              }
            }
          );
        }
      )
  }

  onTextChange(event: Event) {
    this.command.text = (event.target as HTMLTextAreaElement).value;
  }

  public reset() {
    this.command = { text: '' };
  }

  public toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  public addEmoji(event) {
    this.command.text += event.emoji.native;
  }
}
