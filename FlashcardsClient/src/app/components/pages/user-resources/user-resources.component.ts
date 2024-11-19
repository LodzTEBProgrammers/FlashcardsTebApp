import {Component, OnInit} from '@angular/core';
import {FlashcardService} from "../../../services/flashcard.service";
import {CommonModule, DatePipe} from "@angular/common";
import {FlashcardSet} from "../../../interfaces/FlashcardSet";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-resources',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './user-resources.component.html',
  styleUrl: './user-resources.component.css'
})
export class UserResourcesComponent implements OnInit {
  flashcardSets: FlashcardSet[] = [];

  constructor(private flashcardService: FlashcardService, private router: Router) {}

  ngOnInit() {
    this.flashcardService.getFlashcardSets().subscribe(sets => {
      this.flashcardSets = sets;
    });
  }

  openSet(setId: string) {
    this.router.navigate(['/set', setId]);
  }
}
