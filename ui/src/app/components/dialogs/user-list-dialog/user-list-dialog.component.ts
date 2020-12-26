import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@models/user.model';

export interface UserListDialogComponentData {
  title?: string;
  users?: User[];
}

@Component({
  selector: 'app-user-list-dialog',
  templateUrl: './user-list-dialog.component.html',
  styleUrls: ['./user-list-dialog.component.scss']
})
export class UserListDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserListDialogComponentData,
    public dialog: MatDialogRef<UserListDialogComponent, boolean>,
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialog.close(true);
  }
}
