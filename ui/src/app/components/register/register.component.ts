import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterCommand } from '@models/register-command.model';
import { UserVM } from '@models/user-vm.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

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
    if (this.form.invalid) { return; }

    const command: RegisterCommand = {
      email: this.form.controls.email.value,
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
    };

    this.authService.register(command).subscribe(
      (user: UserVM) => {
        this.router.navigate([`/users/${user.id}`]);
      }
    );
  }

}
