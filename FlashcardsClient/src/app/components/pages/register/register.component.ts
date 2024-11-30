import {Component, inject} from '@angular/core';
import { AccountService } from '../../../services/account.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { CompareValidation } from "../../../validators/comparing-passwords-validator";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isRegisterFormSubmitted: boolean = false;

  private accountService = inject(AccountService);
  private router = inject(Router);

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

  get register_personNameControl(): any {
    return this.registerForm.controls["personName"];
  }

  get register_emailControl(): any {
    return this.registerForm.controls["email"];
  }

  get register_passwordControl(): any {
    return this.registerForm.controls["password"];
  }

  get register_confirmPasswordControl(): any {
    return this.registerForm.controls["confirmPassword"];
  }

  registerSubmitted() {
    this.isRegisterFormSubmitted = true;

    if (this.registerForm.valid) {

      this.accountService.postRegister(this.registerForm.value).subscribe({
        next: (response: any) => {
          console.log(response);

          this.isRegisterFormSubmitted = false;

          this.router.navigate(['/resources']);
          localStorage["token"] = response.token;

          this.registerForm.reset();
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
