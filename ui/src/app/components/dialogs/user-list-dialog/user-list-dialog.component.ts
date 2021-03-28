import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { EnvironmentService } from '@services/environment.service';

export interface UserListDialogComponentData {
  title?: string;
  systemEntities?: SystemEntityVM[];
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
    public environment: EnvironmentService,
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialog.close(true);
  }
}
