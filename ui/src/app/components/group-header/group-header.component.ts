import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionBottomSheetComponent, ConfirmActionBottomSheetComponentData } from '@components/bottom-sheets/confirm-action-bottom-sheet/confirm-action-bottom-sheet.component';
import { ConfirmActionDialogComponent, ConfirmActionDialogComponentData } from '@components/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { ReportDialogComponent, ReportDialogData } from '@components/dialogs/report-dialog/report-dialog.component';
import { UserListDialogComponent, UserListDialogComponentData } from '@components/dialogs/user-list-dialog/user-list-dialog.component';
import { ImageType } from '@models/internal/image-type.model';
import { ReportType } from '@models/internal/report-type.model';
import { BusinessErrorCode } from '@models/response/business-error-code.model';
import { GroupVM } from '@models/response/group-vm.model';
import { SystemEntityVM } from '@models/response/system-entity-vm.model';
import { AuthService } from '@services/auth.service';
import { EnvironmentService } from '@services/environment.service';
import { MediaService } from '@services/media.service';
import { SnackbarService } from '@services/snackbar.service';
import { SystemEntityService } from '@services/system-entity.service';

@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss']
})
export class GroupHeaderComponent implements OnInit, OnChanges {
  @Input() group: GroupVM;
  @Input() followers: SystemEntityVM[];
  @Input() following: SystemEntityVM[];

  isFollowing = false;
  renderedImage: string;
  newMediaType: string;
  coverPreviewMode = false;
  profilePreviewMode = false;

  @ViewChild('mediaInput') mediaInput: ElementRef;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private mediaService: MediaService,
    private systemEntityService: SystemEntityService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.followers) {
      if (this.followers.find((e) => e.id === this.authService.activeSystemEntityValue.id)) {
        this.isFollowing = true;
      }
    }
  }

  switchToGroup() {
    this.authService.switchToGroup(this.group.id).subscribe();
  }

  switchFromGroup() {
    this.authService.switchFromGroup();
  }

  follow() {
    this.systemEntityService.follow(this.group.id).subscribe(
      () => {
        this.isFollowing = true;
        this.followers.push(this.authService.activeSystemEntityValue);
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

  unfollow() {
    const confirmDialog = this.dialog.open<ConfirmActionDialogComponent, ConfirmActionDialogComponentData, boolean>(
      ConfirmActionDialogComponent,
      {
        data: {
          title: 'Confirm unfollowing',
          text: `Are you sure that you want to unfollow ${this.group.qualifiedName}?`
        },
        autoFocus: false
      }
    );
    confirmDialog.afterClosed().subscribe(
      (confirmed) => {
        if (confirmed) {
          this.systemEntityService.unfollow(this.group.id).subscribe(
            () => {
              this.isFollowing = false;
              const index = this.followers.findIndex((e) => e.id === this.authService.activeSystemEntityValue.id);
              if (index !== -1) {
                this.followers.splice(index, 1);
              }
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
      }
    );
  }

  seeFollowers() {
    this.dialog.open<UserListDialogComponent, UserListDialogComponentData, boolean>(
      UserListDialogComponent,
      {
        data: {
          title: 'Followers',
          systemEntities: this.followers
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
          systemEntities: this.following
        },
        autoFocus: false,
        minWidth: '300px'
      }
    );
  }

  editCoverPicture(image: File) {
    this.coverPreviewMode = true;
    const oldImage = this.group.coverImagePath;
    this.group.coverImagePath = this.renderedImage;
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
              this.group.coverImagePath = oldImage;
              this.coverPreviewMode = false;
            }
          );
        } else {
          this.group.coverImagePath = oldImage;
          this.coverPreviewMode = false;
        }
      }
    );
  }

  editProfilePicture(image: File) {
    this.profilePreviewMode = true;
    const oldImage = this.group.profileImagePath;
    this.group.profileImagePath = this.renderedImage;
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
              this.group.profileImagePath = oldImage;
              this.profilePreviewMode = false;
            }
          );
        } else {
          this.group.profileImagePath = oldImage;
          this.profilePreviewMode = false;
        }
      }
    );
  }

  addMedia(type: string) {
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

  report() {
    const reportDialog = this.dialog.open<ReportDialogComponent, ReportDialogData, ReportType>(
      ReportDialogComponent,
      {
        data: {
          title: `Report group`
        },
        autoFocus: false,
        minWidth: '300px'
      }
    );
    reportDialog.afterClosed().subscribe(
      (reason) => {
        if (!reason) { return; }
        this.systemEntityService.report(this.group.id, { reason }).subscribe(
          () => {
            this.snackbarService.open('Thank you for your report');
          },
          (err) => {
            if (err.code) {
              if (err.code === BusinessErrorCode.AlreadyExists) {
                this.snackbarService.open(`You have already reported ${this.group.qualifiedName}`);
              }
            } else {
              this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
                ErrorDialogComponent,
                {
                  data: {
                    text: 'Unable to report group, something unexpected happened'
                  }
                }
              );
            }
          }
        );
      }
    );
  }

}
