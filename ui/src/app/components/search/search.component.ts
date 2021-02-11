import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SearchResult } from '@models/search-result.model';
import { SearchService } from '@services/search/search.service';
import * as moment from 'moment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchForm: FormGroup;
  searchResults: SearchResult[] = [];
  pagedSearchResults: SearchResult[];
  pageSize = 10;
  fromNow: string;

  constructor(
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchText: new FormControl(''),
      searchUsers: new FormControl(true),
      searchGroups: new FormControl(true),
      searchPosts: new FormControl(true),
      searchComments: new FormControl(true),
    });
    this.fromNow = moment(new Date()).fromNow();
  }

  pageChangeEvent(event: PageEvent) {
    const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.pagedSearchResults = this.searchResults.slice(offset).slice(0, event.pageSize);
    this.pageSize = event.pageSize;
  }

  search() {
    const kinds = [];
    if (this.searchForm.controls.searchUsers.value) {
      kinds.push(SearchResult.KindEnum.User);
    }
    if (this.searchForm.controls.searchGroups.value) {
      kinds.push(SearchResult.KindEnum.Group);
    }
    if (this.searchForm.controls.searchPosts.value) {
      kinds.push(SearchResult.KindEnum.Post);
    }
    if (this.searchForm.controls.searchComments.value) {
      kinds.push(SearchResult.KindEnum.Comment);
    }
    this.searchService.search(this.searchForm.controls.searchText.value, kinds).subscribe(
      (results) => {
        this.searchResults = results;
        this.pagedSearchResults = this.searchResults.slice(0, this.pageSize);
        this.paginator.firstPage();
      }
    );
  }
}
