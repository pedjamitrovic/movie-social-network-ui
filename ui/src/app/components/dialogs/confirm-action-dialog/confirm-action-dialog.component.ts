import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmActionDialogComponentData {
  title?: string;
  text?: string;
}

@Component({
  selector: 'app-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.scss']
})
export class ConfirmActionDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmActionDialogComponentData,
    public dialog: MatDialogRef<ConfirmActionDialogComponent, boolean>,
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialog.close(false);
  }

  confirm() {
    this.dialog.close(true);
  }
}
