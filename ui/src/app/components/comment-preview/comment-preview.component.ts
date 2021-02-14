import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '@services/comment/comment.service';
import { Comment } from '@models/comment.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-comment-preview',
  templateUrl: './comment-preview.component.html',
  styleUrls: ['./comment-preview.component.scss']
})
export class CommentPreviewComponent implements OnInit {
  public comment: Comment;
  public id: string;

  constructor(
    public ar: ActivatedRoute,
    public commentService: CommentService,
  ) { }

  ngOnInit(): void {
    this.ar.params
      .pipe(
        switchMap(
          (params) => {
            this.id = params.id;
            return this.commentService.getComments();
          }
        )
      )
      .subscribe(
        (comments) => {
          this.comment = comments[0];
          this.comment.id = this.id;
        }
      );
  }
}
