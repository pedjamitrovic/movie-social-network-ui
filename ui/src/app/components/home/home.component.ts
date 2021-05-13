import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

enum HomeComponentState {
  Login = 'login',
  Register = 'register'
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  state: HomeComponentState = HomeComponentState.Login;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.activeSystemEntityValue) {
      this.router.navigate(['/feed']);
    }
  }

  toggleState() {
    if (this.state === HomeComponentState.Login) {
      this.state = HomeComponentState.Register
    } else {
      this.state = HomeComponentState.Login;
    }
  }

}
