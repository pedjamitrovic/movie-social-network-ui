import { Component, Input, OnInit } from '@angular/core';
import { CommentVM } from '@models/comment-vm.model';
import { ReactionType } from '@models/reaction-type.model';
import { ReactionVM } from '@models/reaction-vm-model';
import { AuthService } from '@services/auth.service';
import { ContentService } from '@services/content.service';
import { EnvironmentService } from '@services/environment.service';
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
  @Input() padded = false;

  date = new Date();
  fromNow: string;
  score = 0;

  private _comment: CommentVM;

  constructor(
    public environment: EnvironmentService,
    public authService: AuthService,
    private contentService: ContentService,
  ) { }

  ngOnInit(): void {
    this.calcScore();
  }

  calcScore() {
    const likes = this._comment.reactionStats.find((e) => e.value === ReactionType.Like)?.count || 0;
    const dislikes = this._comment.reactionStats.find((e) => e.value === ReactionType.Dislike)?.count || 0;
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

}
