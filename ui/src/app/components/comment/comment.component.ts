import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { ReportDialogComponent, ReportDialogData } from '@components/dialogs/report-dialog/report-dialog.component';
import { ReactionType } from '@models/internal/reaction-type.model';
import { ReportType } from '@models/internal/report-type.model';
import { BusinessErrorCode } from '@models/response/business-error-code.model';
import { CommentVM } from '@models/response/comment-vm.model';
import { ReactionVM } from '@models/response/reaction-vm.model';
import { AuthService } from '@services/auth.service';
import { ContentService } from '@services/content.service';
import { EnvironmentService } from '@services/environment.service';
import { SnackbarService } from '@services/snackbar.service';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() set comment(v: CommentVM) {
    this._comment = v;
    if (this._comment) {
      this.fromNow = moment(this._comment.createdOn).fromNow();
    }
  }
  get comment(): CommentVM {
    return this._comment;
  }

  date = new Date();
  fromNow: string;
  score = 0;

  private _comment: CommentVM;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private contentService: ContentService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.calcScore();
  }

  calcScore() {
    const likes = this._comment.reactionStats?.find((e) => e.value === ReactionType.Like)?.count || 0;
    const dislikes = this._comment.reactionStats?.find((e) => e.value === ReactionType.Dislike)?.count || 0;
    this.score = likes - dislikes;
  }

  like() {
    const reactionValue = this._comment.existingReaction?.value === ReactionType.Like ? ReactionType.None : ReactionType.Like;

    this.contentService.react(this._comment.id, { value: reactionValue })
      .subscribe(
        (reactionVM: ReactionVM) => {
          if (this._comment.existingReaction) {
            this._comment.reactionStats.find(e => e.value === this._comment.existingReaction.value).count--;
          }

          this._comment.existingReaction = reactionVM;

          let reactionStat = this._comment.reactionStats.find(e => e.value === reactionVM.value);

          if (reactionStat) {
            reactionStat.count++;
          } else {
            reactionStat = { value: reactionVM.value, count: 1 };
            this._comment.reactionStats.push(reactionStat);
          }

          this.calcScore();
        }
      );
  }

  dislike() {
    const reactionValue = this._comment.existingReaction?.value === ReactionType.Dislike ? ReactionType.None : ReactionType.Dislike;

    this.contentService.react(this._comment.id, { value: reactionValue })
      .subscribe(
        (reactionVM: ReactionVM) => {
          if (this._comment.existingReaction) {
            this._comment.reactionStats.find(e => e.value === this._comment.existingReaction.value).count--;
          }

          this._comment.existingReaction = reactionVM;

          let reactionStat = this._comment.reactionStats.find(e => e.value === reactionVM.value);

          if (reactionStat) {
            reactionStat.count++;
          } else {
            reactionStat = { value: reactionVM.value, count: 1 };
            this._comment.reactionStats.push(reactionStat);
          }

          this.calcScore();
        }
      );
  }

  urlToClipboard() {
    return `${location.origin}/comments/${this.comment.id}`;
  }

  report() {
    const reportDialog = this.dialog.open<ReportDialogComponent, ReportDialogData, ReportType>(
      ReportDialogComponent,
      {
        data: {
          title: `Report comment`
        },
        autoFocus: false,
        minWidth: '300px'
      }
    );
    reportDialog.afterClosed().subscribe(
      (reason) => {
        if (!reason) { return; }
        this.contentService.report(this.comment.id, { reason }).subscribe(
          () => {
            this.snackbarService.open('Thank you for your report');
          },
          (err) => {
            if (err.code) {
              if (err.code === BusinessErrorCode.AlreadyExists) {
                this.snackbarService.open('You have already reported this comment');
              }
            } else {
              this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
                ErrorDialogComponent,
                {
                  data: {
                    text: 'Unable to report comment, something unexpected happened'
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
