import { Component, Input, OnInit } from '@angular/core';
import { CommentVM } from '@models/comment-vm.model';
import { PagedList } from '@models/paged-list.model';
import { Paging } from '@models/paging.model';
import { SystemEntityVM } from '@models/system-entity-vm.model';
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

  comments: CommentVM[] = [];
  paging: Paging = new Paging();
  pagedList: PagedList<CommentVM> = null;

  private _systemEntity: SystemEntityVM;

  constructor(
    private commentService: CommentService,
  ) { }

  ngOnInit() {
  }

  init() {
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
