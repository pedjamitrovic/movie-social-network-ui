import { Component, OnInit } from '@angular/core';
import { Post } from '@models/post.model';
import { PostService } from '@services/post/post.service';
import * as moment from 'moment';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  throttle = 300;
  scrollDistance = 1;
  date = new Date();
  postDate = moment([2020, 8, 29]).fromNow();

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.getPosts();
    this.getPosts();
  }

  onScrollDown() {
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe((posts: Post[]) => this.posts.push(...posts));
  }

}
