import { Component, OnInit } from '@angular/core';
import { PagedList } from '../../models/paged-list.model';
import { ReportedDetails } from '../../models/reported-details.model';
import { SystemEntityService } from '../../services/system-entity.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportedDetails: PagedList<ReportedDetails>;
  constructor(private systemEntityService: SystemEntityService) { }

  ngOnInit(): void {
    this.systemEntityService.getBannable().subscribe(rd => this.reportedDetails = rd);
  }
}
