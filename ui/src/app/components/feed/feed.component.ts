import { Component, OnInit } from '@angular/core';
import { Post } from '@models/post.model';
import { PostService } from '@services/post/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.getPosts();
  }

  onScrollDown() {
    console.log('xd');
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe(
      (posts: Post[]) => {
        this.posts.push(...posts);
        console.log(posts);
      }
    );
  }

}
