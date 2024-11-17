import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Flashcard} from "../models/flashcard.model";
@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private flashcards: Flashcard[] = this.loadFlashcards();
  private flashcards$ = new BehaviorSubject<Flashcard[]>(this.flashcards);

  getFlashcards() {
    return this.flashcards$.asObservable();
  }

  addFlashcard(flashcard: Flashcard) {
    this.flashcards.push(flashcard);
    this.saveFlashcards();
    this.flashcards$.next(this.flashcards);
  }

  markAsRemembered(id: string) {
    const flashcard = this.flashcards.find(f => f.id === id);
    if (flashcard) {
      flashcard.remembered = true;
      this.flashcards$.next(this.flashcards);
    }
  }

  private saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
  }

  private loadFlashcards(): Flashcard[] {
    const flashcards = localStorage.getItem('flashcards');
    return flashcards ? JSON.parse(flashcards) : [];
  }
}
