import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterModule} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {AccountService} from "../../../services/account.service";
import {CommonModule} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, HeaderComponent, RouterModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  accountService = inject(AccountService)
  router= inject(Router)

  isLoggedIn() {
    return this.accountService.isLoggedIn()
  }

  logout() {
    this.accountService.getLogout()
    this.router.navigate(['/'])
  }
}
