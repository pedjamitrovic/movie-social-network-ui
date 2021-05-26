import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportType } from '../../../models/report-type.model';

export interface ReportDialogData {
  title?: string;
}

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent implements OnInit {
  reason: ReportType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReportDialogData,
    public dialog: MatDialogRef<ReportDialogComponent, ReportType>,
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialog.close();
  }

  confirm() {
    this.dialog.close(this.reason);
  }
}
