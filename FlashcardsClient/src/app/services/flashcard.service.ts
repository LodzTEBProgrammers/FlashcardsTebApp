import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Flashcard} from "../models/flashcard.model";
@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private flashcards: Flashcard[] = [];
  private flashcards$ = new BehaviorSubject<Flashcard[]>(this.flashcards);

  getFlashcards() {
    return this.flashcards$.asObservable();
  }

  addFlashcard(flashcard: Flashcard) {
    this.flashcards.push(flashcard);
    this.flashcards$.next(this.flashcards);
  }

  markAsRemembered(id: string) {
    const flashcard = this.flashcards.find(f => f.id === id);
    if (flashcard) {
      flashcard.remembered = true;
      this.flashcards$.next(this.flashcards);
    }
  }
}
