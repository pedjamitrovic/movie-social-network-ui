import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCommand } from '@models/login-command.model';
import { AuthService } from '@services/auth.service';
import { BusinessErrorCode } from '@models/business-error-code.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<boolean>();

  form: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
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
    if (this.form.invalid || this.submitted) { return; }

    this.setSubmitted(true);

    const command: LoginCommand = {
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
    };

    this.authService.login(command)
      .pipe(finalize(() => this.setSubmitted(false)))
      .subscribe(
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

  setSubmitted(v: boolean) {
    this.submitted = v;
    this.formSubmitted.emit(v);
  }

}
