import {Component, inject} from '@angular/core';
import { AccountService } from "../../../services/account.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginFormSubmitted: boolean = false;

  private accountService = inject(AccountService);
  private router = inject(Router);
  constructor() {
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
        next: (response: any) => {
          console.log(response);

          this.isLoginFormSubmitted = false;
          this.accountService.currentEmail = response.email;
          localStorage["token"] = response.token;
          localStorage["refreshToken"] = response.refreshToken;

          this.router.navigate(['/resources']);

          this.loginForm.reset();
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
        }
      })
    }
  }
}
