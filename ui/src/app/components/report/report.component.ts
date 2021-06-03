import { Component, Input, OnInit } from '@angular/core';
import { ReportedDetails } from '../../models/reported-details.model';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { EnvironmentService } from '../../services/environment.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @Input() reportedDetails: ReportedDetails;

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

  constructor(public environment: EnvironmentService) { }

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

}
