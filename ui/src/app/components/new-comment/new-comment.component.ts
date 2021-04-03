import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '@models/comment.model';
import { NewCommentCommand } from '@models/new-comment-command.model';
import { Post } from '@models/post.model';
import { RenderedMedia } from '@models/rendered-media.model';
import { User } from '@models/user.model';
import { PostService } from '@services/post.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss']
})
export class NewCommentComponent implements OnInit {
  @Input() public set post(v: Post) {
    this._post = v;
  }
  public get post(): Post {
    return this._post;
  }
  @Output() public commentCreated = new EventEmitter<Comment>();

  public user: User;
  public command: NewCommentCommand = { text: '' };
  public renderedMedia: RenderedMedia;
  public showEmojiPicker = false;
  private _post: Post;

  constructor(
    private userService: UserService,
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.generateUser();
  }

  public createComment() {
    if (!this.command.text) return;
    const comment = this.postService.generatePost();
    comment.createdOn = new Date();
    comment.text = this.command.text;
    comment.user = this.user;
    this.commentCreated.emit(comment);
    this.reset();
  }

  public onTextChange(value: string) {
    this.command.text = value;
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
