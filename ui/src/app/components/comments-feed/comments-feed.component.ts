import { Component, Input, OnInit } from '@angular/core';
import { Paging } from '@models/request/paging.model';
import { CommentVM } from '@models/response/comment-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { SystemEntityVM } from '@models/response/system-entity-vm.model';
import { CommentService } from '@services/comment.service';

@Component({
  selector: 'app-comments-feed',
  templateUrl: './comments-feed.component.html',
  styleUrls: ['./comments-feed.component.scss']
})
export class CommentsFeedComponent implements OnInit {
  @Input() set systemEntity(v: SystemEntityVM) {
    this._systemEntity = v;
    if (this._systemEntity) {
      this.init();
    }
  }
  get systemEntity(): SystemEntityVM {
    return this._systemEntity;
  }

  comments: CommentVM[];
  paging: Paging;
  pagedList: PagedList<CommentVM>;

  private _systemEntity: SystemEntityVM;

  constructor(
    private commentService: CommentService,
  ) { }

  ngOnInit() {
  }

  init() {
    this.comments = [];
    this.paging = new Paging();
    this.pagedList = null;
    this.getComments();
  }

  onScrollDown() {
    this.getComments();
  }

  getComments() {
    if (this.pagedList && this.paging.pageNumber > this.pagedList.totalPages) { return; }

    const queryParams: any = {
      ...this.paging
    };

    if (this.systemEntity) { queryParams.creatorId = this.systemEntity.id; }

    this.commentService.getList(queryParams).subscribe(
      (pagedList) => {
        this.comments.push(...pagedList.items);
        this.pagedList = pagedList;
        this.paging.pageNumber = this.pagedList.page + 1;
      }
    );
  }
}
