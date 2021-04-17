import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { ChangeDescriptionCommand } from '@models/change-description-command';
import { GroupVM } from '@models/group-vm.model';
import { Group } from '@models/group.model';
import { AuthService } from '@services/auth.service';
import { SystemEntityService } from '@services/system-entity.service';

@Component({
  selector: 'app-group-about',
  templateUrl: './group-about.component.html',
  styleUrls: ['./group-about.component.scss']
})
export class GroupAboutComponent implements OnInit, OnChanges {
  @Input() group: GroupVM;
  @Input() groups: Group[];

  showEmojiPicker = false;
  editMode = false;
  command: ChangeDescriptionCommand;
  pagedGroups: Group[];
  pageSize = 8;

  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

  constructor(
    public authService: AuthService,
    private systemEntityService: SystemEntityService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.groups && sc.groups.currentValue) {
      this.pagedGroups = this.groups.slice(0, this.pageSize);
      this.paginator.firstPage();
    }
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
    const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.pagedGroups = this.groups.slice(offset).slice(0, event.pageSize);
    this.pageSize = event.pageSize;
  }

}
