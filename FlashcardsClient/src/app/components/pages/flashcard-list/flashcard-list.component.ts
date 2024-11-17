import {Component, OnInit} from '@angular/core';
import {Flashcard} from "../../../models/flashcard.model";
import {FlashcardService} from "../../../services/flashcard.service";

@Component({
  selector: 'app-flashcard-list',
  standalone: true,
  imports: [],
  templateUrl: './flashcard-list.component.html',
  styleUrl: './flashcard-list.component.css'
})
export class FlashcardListComponent implements OnInit {
  flashcards: Flashcard[] = [];

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit() {
    this.flashcardService.getFlashcards().subscribe(flashcards => {
      this.flashcards = flashcards;
    });
  }

  markAsRemembered(id: string) {
    this.flashcardService.markAsRemembered(id);
  }

  deleteFlashcard(id: string) {
    this.flashcardService.deleteFlashcard(id);
  }
}

