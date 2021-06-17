import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Paging } from '@models/request/paging.model';
import { PagedList } from '@models/response/paged-list.model';
import { SearchResult } from '@models/response/search-result.model';
import { CommentService } from '@services/comment.service';
import { GroupService } from '@services/group.service';
import { PostService } from '@services/post.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  searchKinds = [SearchResult.KindEnum.User, SearchResult.KindEnum.Group, SearchResult.KindEnum.Post, SearchResult.KindEnum.Comment];

  paging: Paging;
  pagedList: PagedList<SearchResult>;
  loading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private postService: PostService,
    private commentService: CommentService,
  ) { }

  ngOnInit() {
    this.init();
    this.searchForm = new FormGroup(
      {
        searchText: new FormControl(''),
        searchKind: new FormControl(SearchResult.KindEnum.User),
      }
    );
    this.search();
  }

  init() {
    this.paging = new Paging();
    this.pagedList = null;
  }

  pageChangeEvent(event: PageEvent) {
    this.paging.pageNumber = event.pageIndex + 1;
    this.paging.pageSize = event.pageSize;
    if (event.previousPageIndex === event.pageIndex) {
      this.paginator.firstPage();
    }
    this.pageChange();
  }

  pageChange() {
    this.loading = true;

    switch (this.searchForm.controls.searchKind.value) {
      case SearchResult.KindEnum.User:
        this.getGroups();
        break;
      case SearchResult.KindEnum.Group:
        this.getUsers();
        break;
      case SearchResult.KindEnum.Post:
        this.getPosts();
        break;
      case SearchResult.KindEnum.Comment:
        this.getComments();
        break;
    }
  }

  search() {
    if (this.loading) { return; }

    this.loading = true;

    this.init();

    switch (this.searchForm.controls.searchKind.value) {
      case SearchResult.KindEnum.User:
        this.getUsers();
        break;
      case SearchResult.KindEnum.Group:
        this.getGroups();
        break;
      case SearchResult.KindEnum.Post:
        this.getPosts();
        break;
      case SearchResult.KindEnum.Comment:
        this.getComments();
        break;
    }
    if (this.paginator) this.paginator.firstPage();
  }

  getUsers() {
    const queryParams: any = {
      ...this.paging
    };

    if (this.searchForm.controls.searchText.value) { queryParams.q = this.searchForm.controls.searchText.value; }

    this.userService.getList(queryParams).subscribe(
      (pagedList) => {
        const searchResults: SearchResult[] = pagedList.items.map(e => ({ kind: SearchResult.KindEnum.User, result: e }));
        this.pagedList = Object.assign({}, pagedList, { items: searchResults });
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  getGroups() {
    const queryParams: any = {
      ...this.paging
    };

    if (this.searchForm.controls.searchText.value) { queryParams.q = this.searchForm.controls.searchText.value; }

    this.groupService.getList(queryParams).subscribe(
      (pagedList) => {
        const searchResults: SearchResult[] = pagedList.items.map(e => ({ kind: SearchResult.KindEnum.Group, result: e }));
        this.pagedList = Object.assign({}, pagedList, { items: searchResults });
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  getPosts() {
    const queryParams: any = {
      ...this.paging
    };

    if (this.searchForm.controls.searchText.value) { queryParams.q = this.searchForm.controls.searchText.value; }

    this.postService.getList(queryParams).subscribe(
      (pagedList) => {
        const searchResults: SearchResult[] = pagedList.items.map(e => ({ kind: SearchResult.KindEnum.Post, result: e }));
        this.pagedList = Object.assign({}, pagedList, { items: searchResults });
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  getComments() {
    const queryParams: any = {
      ...this.paging
    };

    if (this.searchForm.controls.searchText.value) { queryParams.q = this.searchForm.controls.searchText.value; }

    this.commentService.getList(queryParams).subscribe(
      (pagedList) => {
        const searchResults: SearchResult[] = pagedList.items.map(e => ({ kind: SearchResult.KindEnum.Comment, result: e }));
        this.pagedList = Object.assign({}, pagedList, { items: searchResults });
        this.loading = false;
      },
      () => this.loading = false
    );
  }
}
