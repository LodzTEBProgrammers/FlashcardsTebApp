import {Component, inject} from '@angular/core';
import { AccountService } from "../../../services/account.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule, MatInputModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginFormSubmitted: boolean = false;
  hide = true;

  private accountService = inject(AccountService);
  private router = inject(Router);
  private matSnackBar = inject(MatSnackBar);

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  loginSubmitted() {
    this.isLoginFormSubmitted = true;

    if (this.loginForm.valid) {
      this.accountService.postLogin(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log(response);

          this.isLoginFormSubmitted = false;
          localStorage["token"] = response.token;
          localStorage["refreshToken"] = response.refreshToken;

          this.router.navigate(['/']);

          this.loginForm.reset();
          this.matSnackBar.open('Pomyślnie zalogowano! :)', 'Zamknij', { duration: 5000 });
        },
        error: (error) => {
          console.error(error);
          this.matSnackBar.open('Logowanie nieudane :(', 'Zamknij', { duration: 5000 });
        },
        complete: () => {
        }
      })
    }
  }
}
