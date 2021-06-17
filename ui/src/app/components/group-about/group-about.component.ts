import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { ChangeDescriptionCommand } from '@models/request/change-description-command';
import { Paging } from '@models/request/paging.model';
import { GroupVM } from '@models/response/group-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { AuthService } from '@services/auth.service';
import { EnvironmentService } from '@services/environment.service';
import { GroupService } from '@services/group.service';
import { SystemEntityService } from '@services/system-entity.service';
@Component({
  selector: 'app-group-about',
  templateUrl: './group-about.component.html',
  styleUrls: ['./group-about.component.scss']
})
export class GroupAboutComponent implements OnInit {
  @Input() set group(v: GroupVM) {
    this._group = v;
    if (this._group) {
      this.search();
    }
  }
  get group(): GroupVM {
    return this._group;
  }

  showEmojiPicker = false;
  editMode = false;
  command: ChangeDescriptionCommand;
  paging: Paging;
  pagedList: PagedList<GroupVM>;
  loading = false;

  private _group: GroupVM;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public authService: AuthService,
    public environment: EnvironmentService,
    private systemEntityService: SystemEntityService,
    private dialog: MatDialog,
    private groupService: GroupService,
  ) { }

  ngOnInit() { }

  init() {
    this.paging = new Paging();
    this.pagedList = null;
  }

  editBio() {
    this.editMode = !this.editMode;
    this.command = { description: this.group.description };
  }

  cancelEditBio() {
    this.editMode = false;
  }

  saveBio() {
    this.systemEntityService.changeDescription(this.authService.activeSystemEntityValue.id, this.command).subscribe(
      () => {
        this.editMode = false;
        this.group.description = this.command.description;
      },
      () => {
        this.editMode = false;
        this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
          ErrorDialogComponent,
          {
            data: {
              text: 'Unable to change description, something unexpected happened'
            }
          }
        );
      }
    );
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    this.command.description += event.emoji.native;
  }

  onTextChange(event: Event) {
    this.command.description = (event.target as HTMLTextAreaElement).value;
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
      followerId: this.group.id
    };

    this.groupService.getList(queryParams).subscribe(
      (pagedList) => {
        this.pagedList = pagedList;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

}
