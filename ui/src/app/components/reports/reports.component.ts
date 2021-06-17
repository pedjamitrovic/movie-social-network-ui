import { Component, OnInit } from '@angular/core';
import { PagedList } from '@models/response/paged-list.model';
import { ReportedDetails } from '@models/response/reported-details.model';
import { SystemEntityService } from '@services/system-entity.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  reportedDetails: PagedList<ReportedDetails>;
  loading = true;

  constructor(
    private systemEntityService: SystemEntityService
  ) { }

  ngOnInit() {
    this.systemEntityService.getBannable()
      .pipe(finalize(() => this.loading = false))
      .subscribe(rd => this.reportedDetails = rd);
  }

  reportReviewed(rd: ReportedDetails) {
    const index = this.reportedDetails.items.findIndex((e) => e === rd);
    if (index !== -1) this.reportedDetails.items.splice(index, 1);
  }
}
