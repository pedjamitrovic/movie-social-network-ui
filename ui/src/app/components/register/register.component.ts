import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterCommand } from '@models/register-command.model';
import { UserVM } from '@models/user-vm.model';
import { AuthService } from '@services/auth.service';
import { BusinessErrorCode } from '@models/business-error-code.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<boolean>();

  form: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      }
    );
  }

  register() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitted) { return; }

    this.setSubmitted(true);

    const command: RegisterCommand = {
      email: this.form.controls.email.value,
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
    };

    this.authService.register(command)
      .pipe(finalize(() => this.setSubmitted(false)))
      .subscribe(
        (user: UserVM) => {
          this.router.navigate(['/users', user.id]);
        },
        (err) => {
          if (err.code) {
            if (err.code === BusinessErrorCode.EmailAlreadyExists) {
              this.form.controls.email.setErrors({ alreadyExists: true });

            } else if (err.code === BusinessErrorCode.UsernameAlreadyExists) {
              this.form.controls.username.setErrors({ alreadyExists: true });
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
