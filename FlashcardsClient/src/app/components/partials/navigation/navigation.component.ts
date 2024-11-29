import { Component } from '@angular/core';
import {RouterLink, RouterModule} from "@angular/router";
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, HeaderComponent, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

}
