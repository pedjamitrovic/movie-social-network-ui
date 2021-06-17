import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { ReportDialogComponent, ReportDialogData } from '@components/dialogs/report-dialog/report-dialog.component';
import { ReactionType } from '@models/internal/reaction-type.model';
import { RenderedMedia } from '@models/internal/rendered-media.model';
import { ReportType } from '@models/internal/report-type.model';
import { Paging } from '@models/request/paging.model';
import { BusinessErrorCode } from '@models/response/business-error-code.model';
import { CommentVM } from '@models/response/comment-vm.model';
import { PagedList } from '@models/response/paged-list.model';
import { PostVM } from '@models/response/post-vm.model';
import { ReactionVM } from '@models/response/reaction-vm.model';
import { AuthService } from '@services/auth.service';
import { CommentService } from '@services/comment.service';
import { ContentService } from '@services/content.service';
import { EnvironmentService } from '@services/environment.service';
import { MediaService } from '@services/media.service';
import { SnackbarService } from '@services/snackbar.service';
import { Constants } from '@util/constants';
import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() set post(v: PostVM) {
    this._post = v;
    this.initData();
  }
  get post(): PostVM {
    return this._post;
  }

  fromNow: string;
  commentsExpanded = false;
  renderedMedia: RenderedMedia;
  youtubeUrl: string;
  score = 0;

  comments: CommentVM[] = [];
  paging: Paging = new Paging();
  pagedList: PagedList<CommentVM> = null;

  private _post: PostVM;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private mediaService: MediaService,
    private commentService: CommentService,
    private contentService: ContentService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit() { }

  async initData() {
    if (!this._post) { return; }

    this.calcScore();

    this.getComments();

    this.fromNow = moment(this._post.createdOn).fromNow();

    if (this._post.filePath) {
      this.mediaService.readFileFromUrl(this._post.filePath)
        .subscribe(
          async (file: File) => {
            this.renderedMedia = await this.mediaService.renderMedia([file]);
          }
        );
    }

    const execArray = Constants.YOUTUBE_URL_REGEX.exec(this._post.text);

    if (execArray) {
      this.youtubeUrl = execArray[0];
    }
    else {
      this.youtubeUrl = null;
    }
  }

  calcScore() {
    const likes = this._post.reactionStats?.find((e) => e.value === ReactionType.Like)?.count || 0;
    const dislikes = this._post.reactionStats?.find((e) => e.value === ReactionType.Dislike)?.count || 0;
    this.score = likes - dislikes;
  }

  like() {
    const reactionValue = this._post.existingReaction?.value === ReactionType.Like ? ReactionType.None : ReactionType.Like;

    this.contentService.react(this._post.id, { value: reactionValue })
      .subscribe(
        (reactionVM: ReactionVM) => {
          if (this._post.existingReaction) {
            this._post.reactionStats.find(e => e.value === this._post.existingReaction.value).count--;
          }

          this._post.existingReaction = reactionVM;

          let reactionStat = this._post.reactionStats.find(e => e.value === reactionVM.value);

          if (reactionStat) {
            reactionStat.count++;
          } else {
            reactionStat = { value: reactionVM.value, count: 1 };
            this._post.reactionStats.push(reactionStat);
          }

          this.calcScore();
        }
      );
  }

  dislike() {
    const reactionValue = this._post.existingReaction?.value === ReactionType.Dislike ? ReactionType.None : ReactionType.Dislike;

    this.contentService.react(this._post.id, { value: reactionValue })
      .subscribe(
        (reactionVM: ReactionVM) => {
          if (this._post.existingReaction) {
            this._post.reactionStats.find(e => e.value === this._post.existingReaction.value).count--;
          }

          this._post.existingReaction = reactionVM;

          let reactionStat = this._post.reactionStats.find(e => e.value === reactionVM.value);

          if (reactionStat) {
            reactionStat.count++;
          } else {
            reactionStat = { value: reactionVM.value, count: 1 };
            this._post.reactionStats.push(reactionStat);
          }

          this.calcScore();
        }
      );
  }

  toggleComments() {
    this.commentsExpanded = !this.commentsExpanded;
  }

  urlToClipboard() {
    return `${location.origin}/posts/${this.post.id}`;
  }

  commentCreated(comment: CommentVM) {
    this.comments.unshift(comment);
    this.pagedList.totalCount++;
  }


  getComments() {
    if (this.pagedList && this.paging.pageNumber > this.pagedList.totalPages) { return; }

    const queryParams: any = {
      ...this.paging
    };

    if (this.post) { queryParams.postId = this.post.id; }

    this.commentService.getList(queryParams).subscribe(
      (pagedList) => {
        this.comments.push(...pagedList.items);
        this.pagedList = pagedList;
        this.paging.pageNumber = this.pagedList.page + 1;
      }
    );
  }

  report() {
    const reportDialog = this.dialog.open<ReportDialogComponent, ReportDialogData, ReportType>(
      ReportDialogComponent,
      {
        data: {
          title: `Report post`
        },
        autoFocus: false,
        minWidth: '300px'
      }
    );
    reportDialog.afterClosed().subscribe(
      (reason) => {
        if (!reason) { return; }
        this.contentService.report(this.post.id, { reason }).subscribe(
          () => {
            this.snackbarService.open('Thank you for your report');
          },
          (err) => {
            if (err.code) {
              if (err.code === BusinessErrorCode.AlreadyExists) {
                this.snackbarService.open('You have already reported this post');
              }
            } else {
              this.dialog.open<ErrorDialogComponent, ErrorDialogComponentData>(
                ErrorDialogComponent,
                {
                  data: {
                    text: 'Unable to report post, something unexpected happened'
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
