import { Component, OnInit } from '@angular/core';
import { User } from '@models/user.model';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  public user: User;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.generateUser();
  }

  public actionActivated(action: string) {
    switch (action) {
      case 'like':
        // this.like();
        break;
      case 'dislike':
        // this.dislike();
        break;
      case 'comment':
        // this.toggleComments();
        break;
      default:
        break;
    }
  }

}
