import {Component, inject} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {AccountService} from "../../../services/account.service";
import {MatMenuModule} from "@angular/material/menu";
import {NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatMenuModule,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  accountService = inject(AccountService)
  matSnackBar = inject(MatSnackBar)
  router= inject(Router)

  isLoggedIn() {
    return this.accountService.isLoggedIn()
  }

  logout() {
    this.accountService.getLogout()
    this.matSnackBar.open('Pomyślnie wylogowano', 'Zamknij', {
      duration: 5000,
      horizontalPosition: 'center',
    })
    this.router.navigate(['/login'])
  }
}
