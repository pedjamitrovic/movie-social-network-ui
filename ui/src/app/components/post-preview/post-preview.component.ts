import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostVM } from '@models/response/post-vm.model';
import { PostService } from '@services/post.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent implements OnInit {
  public post: PostVM;
  public id: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(
          (params) => {
            this.id = params.id;
            return this.postService.getById(this.id);
          }
        )
      )
      .subscribe(
        (post: PostVM) => {
          this.post = post;
        }
      );
  }

}
