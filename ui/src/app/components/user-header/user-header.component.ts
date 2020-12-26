import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionDialogComponent, ConfirmActionDialogComponentData } from '@components/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { UserListDialogComponent, UserListDialogComponentData } from '@components/dialogs/user-list-dialog/user-list-dialog.component';
import { User } from '@models/user.model';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  public isFollowing = false;
  public followers: User[];
  public following: User[];

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => this.followers = users);
    this.userService.getUsers().subscribe((users) => this.following = users);
  }

  follow() {
    this.isFollowing = true;
  }

  unfollow() {
    const confirmDialog = this.dialog.open<ConfirmActionDialogComponent, ConfirmActionDialogComponentData, boolean>(
      ConfirmActionDialogComponent,
      {
        data: {
          title: 'Confirm unfollowing',
          text: 'Are you sure that you want to unfollow Vladimir Sivčev?'
        },
        autoFocus: false
      }
    );
    confirmDialog.afterClosed().subscribe(
      (confirmed) => {
        if (confirmed) {
          this.isFollowing = false;
        }
      }
    )
  }

  seeFollowers() {
    const followersDialog = this.dialog.open<UserListDialogComponent, UserListDialogComponentData, boolean>(
      UserListDialogComponent,
      {
        data: {
          title: 'Followers',
          users: this.followers
        },
        autoFocus: false
      }
    );
  }

  seeFollowing() {
    const followingDialog = this.dialog.open<UserListDialogComponent, UserListDialogComponentData, boolean>(
      UserListDialogComponent,
      {
        data: {
          title: 'Following',
          users: this.following
        },
        autoFocus: false
      }
    );
  }

}
