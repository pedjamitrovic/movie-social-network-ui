import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@models/post.model';
import { PostService } from '@services/post/post.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent implements OnInit {
  public post: Post;
  public id: string;

  constructor(
    public ar: ActivatedRoute,
    public ps: PostService,
  ) { }

  ngOnInit(): void {
    this.ar.params
      .pipe(
        switchMap(
          (params) => {
            this.id = params.id;
            return this.ps.getPosts();
          }
        )
      )
      .subscribe(
        (posts) => {
          this.post = posts[0];
          this.post.id = this.id;
        }
      );
  }

}
