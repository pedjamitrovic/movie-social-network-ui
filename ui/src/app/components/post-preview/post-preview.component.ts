import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostVM } from '@models/post-vm.model';
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
    public activatedRoute: ActivatedRoute,
    public postService: PostService,
  ) { }

  ngOnInit(): void {
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
          console.log(this.post);
        }
      );
  }

}
