import { Component } from '@angular/core';
import {FlashcardService} from "../../services/flashcard.service";
import {Flashcard} from "../../models/flashcard.model";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-flashcard-create',
  standalone: true,
  imports: [],
  templateUrl: './flashcard-create.component.html',
  styleUrl: './flashcard-create.component.css'
})
export class FlashcardCreateComponent {
  flashcards: Flashcard[] = [];
  constructor(private flashcardService: FlashcardService) {}

  ngOnInit() {
    this.flashcardService.getFlashcards().subscribe(flashcards => {
      this.flashcards = flashcards;
    });
  }

  addFlashcard(term: string, definition: string) {
    const newFlashcard: Flashcard = {
      id: uuidv4(),
      term: term,
      definition: definition,
      remembered: false
    };
    this.flashcardService.addFlashcard(newFlashcard);
    console.log('Flashcard added:', newFlashcard);
  }

  markAsRemembered(id: string) {
    this.flashcardService.markAsRemembered(id);
  }
}
