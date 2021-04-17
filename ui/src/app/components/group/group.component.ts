import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { FeedCompConfig } from '@models/feed-comp-config';
import { GroupVM } from '@models/group-vm.model';
import { Group } from '@models/group.model';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { GroupService } from '@services/group.service';
import { SystemEntityService } from '@services/system-entity.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  group: GroupVM;
  followers: SystemEntityVM[];
  following: SystemEntityVM[];
  groups: Group[];
  feedCompConfig: FeedCompConfig;

  constructor(
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private systemEntityService: SystemEntityService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params) => {
        console.log(params.id);
        if (isNaN(+params.id)) {
          this.router.navigate(['/not-found']);
          return;
        }
        forkJoin(
          {
            group: this.groupService.getById(+params.id),
            followers: this.systemEntityService.getFollowers(+params.id),
            following: this.systemEntityService.getFollowing(+params.id),
          }
        ).subscribe(
          (res) => {
            this.group = res.group;
            this.followers = res.followers.items;
            this.following = res.following.items;
            this.feedCompConfig = { creatorId: this.group.id };
          },
          () => {
            this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
              ErrorDialogComponent,
              {
                data: {
                  text: 'Something unexpected happened'
                }
              }
            );
          }
        );
        // this.groupService.getGroups().subscribe(groups => this.groups = groups);
      }
    )
  }

}
