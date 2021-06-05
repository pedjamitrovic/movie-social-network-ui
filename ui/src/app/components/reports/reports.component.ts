import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
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
  loading = true;
  constructor(private systemEntityService: SystemEntityService) { }

  ngOnInit(): void {
    this.systemEntityService.getBannable()
      .pipe(finalize(() => this.loading = false))
      .subscribe(rd => this.reportedDetails = rd);
  }

  reportReviewed(rd: ReportedDetails) {
    const index = this.reportedDetails.items.findIndex((e) => e === rd);
    if (index !== -1) this.reportedDetails.items.splice(index, 1);
  }
}
