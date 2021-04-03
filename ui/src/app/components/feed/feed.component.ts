import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@models/post.model';
import { PostService } from '@services/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  isExploreMode = false;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(
      (e) => {
        this.isExploreMode = e[0].path === 'explore';
      }
    );

    this.getPosts();
  }

  onScrollDown() {
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe(
      (posts: Post[]) => {
        this.posts.push(...posts);
      }
    );
  }

  public createPost(post: Post) {
    this.posts.unshift(post);
  }

}
