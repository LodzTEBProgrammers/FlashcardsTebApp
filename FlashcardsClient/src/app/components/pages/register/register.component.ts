import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', password: '' };
  errorMessages: { [key: string]: string[] } = {};

  constructor(private accountService: AccountService) {}

  register() {
    this.accountService.register(this.user).subscribe(
      response => {
        console.log('User registered successfully', response);
        this.errorMessages = {};
      },
      error => {
        console.error('Error registering user', error);
        this.errorMessages = this.parseValidationErrors(error);
      }
    );
  }

  private parseValidationErrors(error: any): { [key: string]: string[] } {
    const validationErrors: { [key: string]: string[] } = {};
    if (error.status === 400 && error.error && error.error.errors) {
      for (const key in error.error.errors) {
        if (error.error.errors.hasOwnProperty(key)) {
          validationErrors[key] = error.error.errors[key];
        }
      }
    }
    return validationErrors;
  }
}
