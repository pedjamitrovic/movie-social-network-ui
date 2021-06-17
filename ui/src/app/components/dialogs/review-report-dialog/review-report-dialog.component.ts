import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReviewReportCommand } from '@models/request/review-report-command.model';
import { ReportedDetails } from '@models/response/reported-details.model';
import { ReportedStats } from '@models/response/reported-stats.model';

export interface ReviewReportDialogData {
  title?: string;
  reportedDetails?: ReportedDetails;
}

export interface ReviewReportDialogRetData {
  command?: ReviewReportCommand;
}

@Component({
  selector: 'app-report-dialog',
  templateUrl: './review-report-dialog.component.html',
  styleUrls: ['./review-report-dialog.component.scss']
})
export class ReviewReportDialogComponent implements OnInit {
  reviewReportForm: FormGroup;
  minDate: Date;
  minDateControl = new FormControl(null, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReviewReportDialogData,
    private dialog: MatDialogRef<ReviewReportDialogComponent, ReviewReportCommand>,
  ) {
    this.init();
  }

  ngOnInit() { }

  init() {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);

    this.reviewReportForm = new FormGroup(
      {
        issueBan: new FormControl(false, [Validators.required]),
      }
    );

    this.initListeners();
  }

  initListeners() {
    this.reviewReportForm.controls.issueBan.valueChanges.subscribe(
      (v) => {
        if (v) {
          this.reviewReportForm.addControl('bannedUntil', new FormControl(null, [Validators.required]));
          this.reviewReportForm.addControl('reason', new FormControl(null, [Validators.required]));
          this.initReason();
        } else {
          this.reviewReportForm.removeControl('bannedUntil');
          this.reviewReportForm.removeControl('reason');
        }
      }
    )
  }

  initReason() {
    if (!this.data.reportedDetails) return;

    let max: ReportedStats = { count: 0 };

    this.data.reportedDetails.reportedStats.forEach(
      (e) => {
        if (e.count > max.count) max = e;
      }
    );

    if (!max.reason) return;

    this.reviewReportForm.controls.reason.setValue(max.reason);
  }

  cancel() {
    this.dialog.close();
  }

  confirm() {
    const reviewReportCommand: ReviewReportCommand = {
      issueBan: this.reviewReportForm.controls.issueBan.value,
    };

    if (reviewReportCommand.issueBan) {
      reviewReportCommand.reason = this.reviewReportForm.controls.reason.value;
      reviewReportCommand.bannedUntil = this.reviewReportForm.controls.bannedUntil.value;
    }

    this.dialog.close(reviewReportCommand);
  }
}
