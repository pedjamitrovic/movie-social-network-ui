import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedCompConfig } from '@models/feed-comp-config';
import { PagedList } from '@models/paged-list.model';
import { Paging } from '@models/paging.model';
import { PostVM } from '@models/post-vm.model';
import { AuthService } from '@services/auth.service';
import { PostService } from '@services/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  @Input() set config(v: FeedCompConfig) {
    this._config = v;
    if (this._config) {
      this.init();
    }
  }
  get config(): FeedCompConfig {
    return this._config;
  }

  posts: PostVM[];
  paging: Paging;
  pagedList: PagedList<PostVM>;

  private _config: FeedCompConfig;

  constructor(
    public authService: AuthService,
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(
      (e) => {
        switch (e[0].path) {
          case 'feed':
            this.config = { mode: 'feed', followerId: this.authService.activeSystemEntityValue.id };
            break;
          case 'explore':
            this.config = { mode: 'explore' };
            break;
        }
      }
    );
  }

  init() {
    this.posts = [];
    this.paging = new Paging();
    this.pagedList = null;
    this.getPosts();
  }

  onScrollDown() {
    this.getPosts();
  }

  getPosts() {
    if (this.pagedList && this.paging.pageNumber > this.pagedList.totalPages) { return; }

    const queryParams: any = {
      ...this.paging
    };

    if (this.config.creatorId) { queryParams.creatorId = this.config.creatorId; }
    if (this.config.followerId) { queryParams.followerId = this.config.followerId; }

    this.postService.getList(queryParams).subscribe(
      (pagedList) => {
        this.posts.push(...pagedList.items);
        this.pagedList = pagedList;
        this.paging.pageNumber = this.pagedList.page + 1;
      }
    );
  }

  public createPost(post: PostVM) {
    this.posts.unshift(post);
  }

}
