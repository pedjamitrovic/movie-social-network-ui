import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { ReviewReportDialogComponent, ReviewReportDialogData } from '@components/dialogs/review-report-dialog/review-report-dialog.component';
import { ReviewReportCommand } from '@models/request/review-report-command.model';
import { ReportedDetails } from '@models/response/reported-details.model';
import { EnvironmentService } from '@services/environment.service';
import { SnackbarService } from '@services/snackbar.service';
import { SystemEntityService } from '@services/system-entity.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @Input() reportedDetails: ReportedDetails;
  @Output() reviewed = new EventEmitter<ReportedDetails>();

  labels = ['Sexual', 'Violent', 'Hateful', 'Child abuse', 'Promotes terrorism', 'Spam', 'Infringes rights'];
  colors: Color[] = [
    { backgroundColor: ['#003f5c', '#374c80', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600'] }
  ];
  datasets: ChartDataSets[] = [
    {
      data: []
    }
  ];
  legend = true;
  options: ChartOptions = {
    legend: {
      position: 'bottom'
    }
  }
  type: ChartType = 'pie';
  totalReports = 0;

  constructor(
    public environment: EnvironmentService,
    private dialog: MatDialog,
    private systemEntityService: SystemEntityService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    if (!this.reportedDetails) { return; }

    this.reportedDetails.reportedStats.forEach(
      rs => {
        switch (rs.reason) {
          case 'sexual':
            this.datasets[0].data[0] = rs.count;
            this.totalReports += rs.count;
            break;
          case 'violent':
            this.datasets[0].data[1] = rs.count;
            this.totalReports += rs.count;
            break;
          case 'hateful':
            this.datasets[0].data[2] = rs.count;
            this.totalReports += rs.count;
            break;
          case 'childAbuse':
            this.datasets[0].data[3] = rs.count;
            this.totalReports += rs.count;
            break;
          case 'promotesTerrorism':
            this.datasets[0].data[4] = rs.count;
            this.totalReports += rs.count;
            break;
          case 'spam':
            this.datasets[0].data[5] = rs.count;
            this.totalReports += rs.count;
            break;
          case 'infringesRights':
            this.datasets[0].data[6] = rs.count;
            this.totalReports += rs.count;
            break;
        }
      }
    );
  }

  review() {
    const reportDialog = this.dialog.open<ReviewReportDialogComponent, ReviewReportDialogData, ReviewReportCommand>(
      ReviewReportDialogComponent,
      {
        data: { reportedDetails: this.reportedDetails },
        autoFocus: false,
        minWidth: '300px'
      }
    );
    reportDialog.afterClosed().subscribe(
      (command) => {
        if (!command) { return; }
        this.systemEntityService.resolveReport(this.reportedDetails.extended.id, command).subscribe(
          () => {
            this.reviewed.emit(this.reportedDetails);
            this.snackbarService.open('Thank you for resolving report');
          },
          () => {
            this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
              ErrorDialogComponent,
              {
                data: {
                  text: 'Unable to resolve report, something unexpected happened'
                }
              }
            );
          }
        );
      }
    );
  }

}
