import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public get f() {
    return this.form.controls;
  }

  form: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return; }
  }

}
