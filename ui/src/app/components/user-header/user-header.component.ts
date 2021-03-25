import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionBottomSheetComponent, ConfirmActionBottomSheetComponentData } from '@components/bottom-sheets/confirm-action-bottom-sheet/confirm-action-bottom-sheet.component';
import { ConfirmActionDialogComponent, ConfirmActionDialogComponentData } from '@components/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { UserListDialogComponent, UserListDialogComponentData } from '@components/dialogs/user-list-dialog/user-list-dialog.component';
import { UserVM } from '@models/user-vm.model';
import { User } from '@models/user.model';
import { MediaService } from '@services/media/media.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  @Input() user: UserVM;

  public isFollowing = false;
  public followers: User[];
  public following: User[];
  public renderedImage: string;
  public newMediaType: 'cover' | 'profile';

  @ViewChild('mediaInput') public mediaInput: ElementRef;

  constructor(
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private userService: UserService,
    private mediaService: MediaService,
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
    );
  }

  seeFollowers() {
    this.dialog.open<UserListDialogComponent, UserListDialogComponentData, boolean>(
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
    this.dialog.open<UserListDialogComponent, UserListDialogComponentData, boolean>(
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
    const oldImage = this.user.coverImagePath;
    this.user.coverImagePath = this.renderedImage;
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
          this.user.coverImagePath = oldImage;
        }
      }
    );
  }

  editProfilePicture() {
    const oldImage = this.user.profileImagePath;
    this.user.profileImagePath = this.renderedImage;
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
          this.user.profileImagePath = oldImage;
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
