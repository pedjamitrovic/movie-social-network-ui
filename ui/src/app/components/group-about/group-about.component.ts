import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Group } from '@models/group.model';

@Component({
  selector: 'app-group-about',
  templateUrl: './group-about.component.html',
  styleUrls: ['./group-about.component.scss']
})
export class GroupAboutComponent implements OnInit, OnChanges {
  @Input() group: Group;
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
    if (sc.groups.currentValue) {
      this.pagedGroups = this.groups.slice(0, this.pageSize);
      this.paginator.firstPage();
    }
  }

  editBio() {
    this.editMode = !this.editMode;
    this.command = { text: this.group.description };
  }

  cancelEditBio() {
    this.editMode = false;
  }

  saveBio() {
    this.editMode = false;
    this.group.description = this.command.text;
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
