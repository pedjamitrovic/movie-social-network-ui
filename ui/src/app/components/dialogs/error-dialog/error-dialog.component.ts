import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ErrorDialogComponentData {
  text?: string;
}

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogComponentData,
    private dialog: MatDialogRef<ErrorDialogComponent>,
  ) { }

  ngOnInit() { }

  close() {
    this.dialog.close();
  }
}
