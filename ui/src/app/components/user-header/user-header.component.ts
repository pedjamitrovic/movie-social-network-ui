import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionBottomSheetComponent, ConfirmActionBottomSheetComponentData } from '@components/bottom-sheets/confirm-action-bottom-sheet/confirm-action-bottom-sheet.component';
import { ConfirmActionDialogComponent, ConfirmActionDialogComponentData } from '@components/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { UserListDialogComponent, UserListDialogComponentData } from '@components/dialogs/user-list-dialog/user-list-dialog.component';
import { ImageType } from '@models/image-type.model';
import { UserVM } from '@models/user-vm.model';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';
import { MediaService } from '@services/media/media.service';
import { SystemEntityService } from '@services/system-entity.service';
import { UserService } from '@services/user/user.service';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { EnvironmentService } from '@services/environment.service';

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
  public newMediaType: string;
  public coverPreviewMode = false;
  public profilePreviewMode = false;

  @ViewChild('mediaInput') public mediaInput: ElementRef;

  constructor(
    public environment: EnvironmentService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private userService: UserService,
    private mediaService: MediaService,
    private systemEntityService: SystemEntityService,
    private authService: AuthService,
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
        autoFocus: false,
        minWidth: '300px'
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
        autoFocus: false,
        minWidth: '300px'
      }
    );
  }

  editCoverPicture(image: File) {
    this.coverPreviewMode = true;
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
          this.systemEntityService.changeImage(this.authService.activeSystemEntityValue.id, ImageType.Cover, image).subscribe(
            () => { },
            () => {
              this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
                ErrorDialogComponent,
                {
                  data: {
                    text: 'Unable to change cover picture, something unexpected happened'
                  }
                }
              );
              this.user.coverImagePath = oldImage;
              this.coverPreviewMode = false;
            }
          );
        } else {
          this.user.coverImagePath = oldImage;
          this.coverPreviewMode = false;
        }
      }
    );
  }

  editProfilePicture(image: File) {
    this.profilePreviewMode = true;
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
          this.systemEntityService.changeImage(this.authService.activeSystemEntityValue.id, ImageType.Profile, image).subscribe(
            () => { },
            () => {
              this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
                ErrorDialogComponent,
                {
                  data: {
                    text: 'Unable to change profile picture, something unexpected happened'
                  }
                }
              );
              this.user.profileImagePath = oldImage;
              this.profilePreviewMode = false;
            }
          );
        } else {
          this.user.profileImagePath = oldImage;
          this.profilePreviewMode = false;
        }
      }
    );
  }

  public addMedia(type: string) {
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
      if (this.newMediaType === ImageType.Cover) {
        this.editCoverPicture(images[0]);
      } else if (this.newMediaType === ImageType.Profile) {
        this.editProfilePicture(images[0]);
      }
    }

    mediaInput.value = null;
  }

}
