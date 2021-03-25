import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCommand } from '@models/login-command.model';
import { AuthService } from '@services/auth.service';
import { ErrorDialogComponent, ErrorDialogComponentData } from '@components/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BusinessErrorCode } from '@models/business-error-code.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      }
    );
  }

  login() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return; }

    const command: LoginCommand = {
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
    };
    const returnUrl =
      this.authService.login(command).subscribe(
        () => {
          if (this.route.snapshot.queryParams.returnUrl) {
            this.router.navigate([this.route.snapshot.queryParams.returnUrl]);
          } else {
            this.router.navigate(['/feed']);
          }
        },
        (err) => {
          if (err.code) {
            if (err.code === BusinessErrorCode.InvalidUsername) {
              this.form.controls.username.setErrors({ invalid: true });

            } else if (err.code === BusinessErrorCode.InvalidPassword) {
              this.form.controls.password.setErrors({ invalid: true });
            }
          }
        }
      );
  }

}
