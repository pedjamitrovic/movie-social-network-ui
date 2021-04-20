import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { FeedCompConfig } from '@models/feed-comp-config';
import { SystemEntityVM } from '@models/system-entity-vm.model';
import { UserVM } from '@models/user-vm.model';
import { SystemEntityService } from '@services/system-entity.service';
import { UserService } from '@services/user/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: UserVM;
  followers: SystemEntityVM[];
  following: SystemEntityVM[];
  feedCompConfig: FeedCompConfig;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private systemEntityService: SystemEntityService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params) => {
        if (isNaN(+params.id)) {
          this.router.navigate(['/not-found']);
          return;
        }
        forkJoin(
          {
            user: this.userService.getById(+params.id),
            followers: this.systemEntityService.getFollowers(+params.id),
            following: this.systemEntityService.getFollowing(+params.id),
          }
        ).subscribe(
          (res) => {
            this.user = res.user;
            this.followers = res.followers.items;
            this.following = res.following.items;
            this.feedCompConfig = { creatorId: this.user.id };
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
      }
    )
  }

}
