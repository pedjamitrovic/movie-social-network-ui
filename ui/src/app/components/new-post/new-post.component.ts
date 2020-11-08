import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NewPostCommand } from '@models/new-post-command';
import { Post } from '@models/post.model';
import { User } from '@models/user.model';
import { PostService } from '@services/post/post.service';
import { UserService } from '@services/user/user.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  @Output() public postCreated = new EventEmitter<Post>();

  public user: User;
  public command: NewPostCommand = new NewPostCommand();
  public videos: string[];
  public images: string[];

  @ViewChild('mediaInput') public mediaInput: ElementRef;

  constructor(
    private userService: UserService,
    private postService: PostService,
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
    this.command = new NewPostCommand();
  }

  public addMedia() {
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;
    mediaInput.click();
  }

  public renderMedia() {
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;

    if (mediaInput?.files?.length === 0) { return; }

    this.videos = [];
    this.images = [];

    this.command.media = Array.from(mediaInput.files);

    for (const file of this.command.media) {

      const reader = new FileReader();

      fromEvent(reader, 'load')
        .subscribe(
          () => {
            if (file.type.startsWith('image')) {
              this.images.push(reader.result.toString());
            }
            else if (file.type.startsWith('video')) {
              this.videos.push(reader.result.toString());
            }
          }
        );

      reader.readAsDataURL(file);
    }

    mediaInput.value = null;
  }

  public onTextChange(value: string) {
    this.command.text = value;
  }

}
