import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponentState } from '@models/internal/home-comp-state.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  state = HomeComponentState.Login;
  submitted = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
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

  formSubmitted(submitted: boolean) {
    this.submitted = submitted;
  }

}
