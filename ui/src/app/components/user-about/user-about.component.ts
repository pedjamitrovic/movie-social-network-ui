import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Group } from '@models/group.model';
import { UserVM } from '@models/user-vm.model';
import { User } from '@models/user.model';

@Component({
  selector: 'app-user-about',
  templateUrl: './user-about.component.html',
  styleUrls: ['./user-about.component.scss']
})
export class UserAboutComponent implements OnInit, OnChanges {
  @Input() user: UserVM;
  @Input() groups: Group[];

  showEmojiPicker = false;
  editMode = false;
  command: any;
  pagedGroups: Group[];
  pageSize = 8;

  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

  constructor() { }

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
    this.command = { text: this.user.description };
  }

  cancelEditBio() {
    this.editMode = false;
  }

  saveBio() {
    this.editMode = false;
    this.user.description = this.command.text;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    this.command.text += event.emoji.native;
  }

  onTextChange(value: string) {
    this.command.text = value;
  }

  pageChangeEvent(event: PageEvent) {
    const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
    this.pagedGroups = this.groups.slice(offset).slice(0, event.pageSize);
    this.pageSize = event.pageSize;
  }

}
