import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-banned',
  templateUrl: './banned.component.html',
  styleUrls: ['./banned.component.scss']
})
export class BannedComponent implements OnInit {

  constructor(
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.authUserValue || !this.authService.authUserValue.isBanned) {
      this.router.navigate(['/']);
    }
  }

  switchContext() {
    this.authService.switchFromGroup();
  }

  logout() {
    this.authService.logout();
  }

}
