import {Component, inject} from '@angular/core';
import { AccountService } from '../../../services/account.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from "@angular/router";
import { CompareValidation } from "../../../validators/comparing-passwords-validator";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatIconModule, RouterLink, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isRegisterFormSubmitted: boolean = false;

  private accountService = inject(AccountService);
  private router = inject(Router);
  private matSnackBar = inject(MatSnackBar);
  hidePassword = true;
  hideConfirmPassword = true;

  constructor() {
    this.registerForm = new FormGroup({
      personName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    }, {
      validators: [CompareValidation("password", "confirmPassword")]
    });
  }

  registerSubmitted() {
    this.isRegisterFormSubmitted = true;

    if (this.registerForm.valid) {
      this.accountService.postRegister(this.registerForm.value).subscribe({
        next: (response: any) => {
          console.log(response);

          this.isRegisterFormSubmitted = false;
          localStorage["token"] = response.token;

          this.router.navigate(['/']);
          this.registerForm.reset();
          this.matSnackBar.open('Pomyślnie zarejestrowano! :)', 'Zamknij', { duration: 5000 });
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
