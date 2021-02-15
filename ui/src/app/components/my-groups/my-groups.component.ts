import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CreateGroupDialogComponent } from '@components/dialogs/create-group-dialog/create-group-dialog.component';
import { NewGroupCommand } from '@models/new-group-command.model';
import { SearchResult } from '@models/search-result.model';
import { GroupService } from '@services/group/group.service';
import { SearchService } from '@services/search/search.service';
import * as moment from 'moment';
import { timer } from 'rxjs';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchForm: FormGroup;
  searchResults: SearchResult[] = [];
  pagedSearchResults: SearchResult[];
  pageSize = 10;
  fromNow: string;

  constructor(
    private searchService: SearchService,
    private groupService: GroupService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchText: new FormControl(''),
    });
    this.fromNow = moment(new Date()).fromNow();
    this.search();
  }

  pageChangeEvent(event: PageEvent) {
    const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.pagedSearchResults = this.searchResults.slice(offset).slice(0, event.pageSize);
    this.pageSize = event.pageSize;
  }

  search() {
    const kinds = [];
    kinds.push(SearchResult.KindEnum.Group);
    this.searchService.search(this.searchForm.controls.searchText.value, kinds).subscribe(
      (results) => {
        this.searchResults = results;
        this.pagedSearchResults = this.searchResults.slice(0, this.pageSize);
        this.cdr.detectChanges();
        this.paginator.firstPage();
      }
    );
  }

  createNewGroup() {
    const createGroupDialog = this.dialog.open<CreateGroupDialogComponent, any, NewGroupCommand>(
      CreateGroupDialogComponent,
      {
        autoFocus: false
      }
    );
    createGroupDialog.afterClosed().subscribe(
      (command) => {
        if (command) {
          const group = this.groupService.generateGroup();
          timer(1000).subscribe(
            () => {
              this.router.navigate(['/groups', group.id]);
            }
          );
        }
      }
    );
  }
}
