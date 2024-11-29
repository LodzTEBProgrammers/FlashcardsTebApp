import { Component } from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  errorMessage: string | null = null;

  constructor(private accountService: AccountService) {}

  logout() {
    this.accountService.logout().subscribe(
      response => {
        console.log('User logged out successfully', response);
        this.errorMessage = null;
      },
      error => {
        console.error('Error logging out', error);
        this.errorMessage = error;
      }
    );
  }
}
