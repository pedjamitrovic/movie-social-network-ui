import { Injectable } from '@angular/core';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '@models/group.model';
import { GroupService } from '@services/group/group.service';
import { UserService } from '@services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private activeUser: BehaviorSubject<User | Group> = new BehaviorSubject(null);
  private loggedUser: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(
    private userService: UserService,
    private groupService: GroupService,
  ) {
    const user = this.userService.generateUser();
    user.username = 'vladz_nanotech_ceo';
    user.description = 'Greatest CEO ever';
    this.loggedUser.next(user);
    this.activeUser.next(user);
  }

  getActiveUser(): Observable<User | Group> {
    return this.activeUser.asObservable();
  }

  getLoggedUser(): Observable<User> {
    return this.loggedUser.asObservable();
  }

  switchContext() {
    if (this.activeUser.value !== this.loggedUser.value) {
      this.activeUser.next(this.loggedUser.value);
    } else {
      const group = this.groupService.generateGroup();
      group.title = 'Movie nite';
      group.subtitle = 'MOVIE NITE @ PARTY ROYALE\'S BIG SCREEN FEATURES INCEPTION';
      group.description = `Hey folks, We found some technical mistakes and apologize as our Movie Nite test will not be available in Canada or Puerto Rico. We’ll learn from this mistake and work to make a better global experience next time.
      Grab the popcorn! This Friday, June 26 we’re testing Movie Nite at Party Royale’s Big Screen.We’re offering limited screenings of one of three different Christopher Nolan classic full - length feature films-- either Inception, Batman Begins, or The Prestige-- directly in Fortnite.
      Navigating distribution rights for different countries and languages for full movies is challenging.As part of this first test, we wanted as many people to experience Movie Nite as possible.The film you'll be able to watch will depend on your country, and unfortunately we couldn't reach everyone with these screenings.We believe the idea of getting together with your friends and family at Party Royale to watch a movie is powerful and exciting, and we're looking at ways to increase global participation in the future.
      For details on showtimes, check out the full schedule.We’ll be supporting subtitles for the screenings.If you want subtitles enabled, follow our Audio Settings Guide.And remember, just like any theatre - there's no broadcasting or recording these films during the show. So, make sure your crew is there live! Any streams or videos of these films will be subject to anti-piracy and DCMA regulations.
      When you’re ready to watch one of the scheduled screenings, jump into Party Royale and head to the Island’s Big Screen. `;
      this.activeUser.next(group);
    }
  }
}
