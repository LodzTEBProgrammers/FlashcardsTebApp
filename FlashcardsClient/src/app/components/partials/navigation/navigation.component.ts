import { Component } from '@angular/core';
import {Router, RouterLink, RouterModule} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {AccountService} from "../../../services/account.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, HeaderComponent, RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(public accountService: AccountService, private router: Router) { }

  onLogoutClicked() {
    this.accountService.getLogout().subscribe({
      next: (response: string) => {
        this.accountService.currentEmail = null;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
