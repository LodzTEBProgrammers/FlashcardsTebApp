import { Component } from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = { username: '', password: '' };

  constructor(private accountService: AccountService) {}

  login() {
    this.accountService.login(this.user).subscribe(
      response => {
        console.log('Login successful', response);
      },
      error => {
        console.error('Error logging in', error);
      }
    );
  }
}
