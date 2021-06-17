import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CreateGroupDialogComponent } from '@components/dialogs/create-group-dialog/create-group-dialog.component';
import { Paging } from '@models/request/paging.model';
import { PagedList } from '@models/response/paged-list.model';
import { SearchResult } from '@models/response/search-result.model';
import { AuthService } from '@services/auth.service';
import { GroupService } from '@services/group.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  searchForm: FormGroup;

  paging: Paging;
  pagedList: PagedList<SearchResult>;
  loading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public authService: AuthService,
    private groupService: GroupService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.init();
    this.searchForm = new FormGroup(
      {
        searchText: new FormControl(''),
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

    this.getGroups();
  }

  search() {
    if (this.loading) { return; }

    this.loading = true;

    this.init();

    this.getGroups();

    if (this.paginator) this.paginator.firstPage();
  }

  getGroups() {
    const queryParams: any = {
      ...this.paging,
      adminId: this.authService.activeSystemEntityValue.id
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

  createNewGroup() {
    this.dialog.open(
      CreateGroupDialogComponent,
      {
        autoFocus: false,
        minWidth: '300px'
      }
    );
  }
}
