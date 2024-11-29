import { Component } from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginUser} from "../../../models/login-user";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginFormSubmitted: boolean = false;


  constructor(private accountService: AccountService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }


  get login_emailControl(): any {
    return this.loginForm.controls["email"];
  }

  get login_passwordControl(): any {
    return this.loginForm.controls["password"];
  }


  loginSubmitted() {
    this.isLoginFormSubmitted = true;

    if (this.loginForm.valid) {

      this.accountService.postLogin(this.loginForm.value).subscribe({
        next: (response: LoginUser) => {
          console.log(response);

          this.isLoginFormSubmitted = false;
          this.accountService.currentUserName = response.email;

          this.router.navigate(['/']);

          this.loginForm.reset();
        },

        error: (error) => {
          console.log(error);
        },

        complete: () => { },
      });
    }
  }
}
