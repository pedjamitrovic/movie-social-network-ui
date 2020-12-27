import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionBottomSheetComponent, ConfirmActionBottomSheetComponentData } from '@components/bottom-sheets/confirm-action-bottom-sheet/confirm-action-bottom-sheet.component';
import { ConfirmActionDialogComponent, ConfirmActionDialogComponentData } from '@components/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { UserListDialogComponent, UserListDialogComponentData } from '@components/dialogs/user-list-dialog/user-list-dialog.component';
import { User } from '@models/user.model';
import { MediaService } from '@services/media/media.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  @ViewChild('mediaInput') public mediaInput: ElementRef;

  public user: User = new User();
  public isFollowing = false;
  public followers: User[];
  public following: User[];
  public renderedImage: string;
  public newMediaType: 'cover' | 'profile';

  constructor(
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private userService: UserService,
    private mediaService: MediaService,
  ) { }

  ngOnInit(): void {
    this.user.coverImage = "https://scontent.fbeg1-1.fna.fbcdn.net/v/t1.0-9/59022744_10205538098208517_3934019275236311040_o.jpg?_nc_cat=108&ccb=2&_nc_sid=e3f864&_nc_ohc=eGlhnredXP8AX_n8sv4&_nc_ht=scontent.fbeg1-1.fna&oh=6b2272568f43067e6b777823c0a2e762&oe=6004D250"
    this.user.profileImage = "https://scontent.fbeg1-1.fna.fbcdn.net/v/t1.0-9/65219049_10205705790960731_3096226655077662720_o.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_ohc=_4Und1kngQUAX915ret&_nc_ht=scontent.fbeg1-1.fna&oh=81680a281121991d8bf0d23ac4b5f76f&oe=60071597";
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
    );
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

  editCoverPicture() {
    const oldImage = this.user.coverImage;
    this.user.coverImage = this.renderedImage;
    const editCoverPictureBS = this.bottomSheet.open<ConfirmActionBottomSheetComponent, ConfirmActionBottomSheetComponentData, boolean>(
      ConfirmActionBottomSheetComponent,
      {
        data: {
          text: `You've changed your cover picture. Save changes?`
        },
        autoFocus: false
      }
    );
    editCoverPictureBS.afterDismissed().subscribe(
      (confirmed) => {
        if (confirmed) {
          // Call api
        } else {
          this.user.coverImage = oldImage;
        }
      }
    );
  }

  editProfilePicture() {
    const oldImage = this.user.profileImage;
    this.user.profileImage = this.renderedImage;
    const editProfilePictureBS = this.bottomSheet.open<ConfirmActionBottomSheetComponent, ConfirmActionBottomSheetComponentData, boolean>(
      ConfirmActionBottomSheetComponent,
      {
        data: {
          text: `You've changed your profile picture. Save changes?`
        },
        autoFocus: false
      }
    );
    editProfilePictureBS.afterDismissed().subscribe(
      (confirmed) => {
        if (confirmed) {
          // Call api
        } else {
          this.user.profileImage = oldImage;
        }
      }
    );
  }

  public addMedia(type: 'cover' | 'profile') {
    this.newMediaType = type;
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;
    mediaInput.click();
  }

  async addFiles() {
    const mediaInput = this.mediaInput.nativeElement as HTMLInputElement;

    if (mediaInput?.files?.length === 0) { return; }

    const images = Array.from(mediaInput.files);

    const renderedMedia = await this.mediaService.renderMedia(images);

    const image = renderedMedia.images[0];

    if (image) {
      this.renderedImage = image;
      if (this.newMediaType === 'cover') {
        this.editCoverPicture();
      } else if (this.newMediaType === 'profile') {
        this.editProfilePicture();
      }
    }

    mediaInput.value = null;
  }

}
