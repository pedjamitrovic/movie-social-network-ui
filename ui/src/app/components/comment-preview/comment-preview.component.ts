import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentVM } from '@models/comment-vm.model';
import { CommentService } from '@services/comment.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-comment-preview',
  templateUrl: './comment-preview.component.html',
  styleUrls: ['./comment-preview.component.scss']
})
export class CommentPreviewComponent implements OnInit {
  public comment: CommentVM;
  public id: number;

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
            return this.commentService.getById(this.id);
          }
        )
      )
      .subscribe(
        (comment) => {
          this.comment = comment;
        }
      );
  }
}
