import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedCompConfig } from '@models/internal/feed-comp-config.model';
import { Paging } from '@models/request/paging.model';
import { PagedList } from '@models/response/paged-list.model';
import { PostVM } from '@models/response/post-vm.model';
import { AuthService } from '@services/auth.service';
import { PostService } from '@services/post.service';
import { finalize } from 'rxjs/operators';

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
  loading = false;

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
            this.config = {
              mode: 'feed',
              followerId: this.authService.activeSystemEntityValue.id
            };
            break;
          case 'explore':
            this.config = {
              mode: 'explore'
            };
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

    this.loading = true;

    this.postService.getList(queryParams)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
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
