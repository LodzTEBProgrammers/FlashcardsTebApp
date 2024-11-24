import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {FlashcardSet} from "../interfaces/FlashcardSet";
import {Flashcard} from "../interfaces/Flashcard";
@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private flashcardSets: FlashcardSet[] = this.loadFlashcardSets();
  private flashcardSets$ = new BehaviorSubject<FlashcardSet[]>(this.flashcardSets);

  getFlashcardSets(): Observable<FlashcardSet[]> {
    return this.flashcardSets$.asObservable();
  }

  addFlashcardSet(set: FlashcardSet): void {
    this.flashcardSets.push(set);
    this.saveFlashcardSets();
    this.flashcardSets$.next(this.flashcardSets);
  }

  addFlashcard(setId: string, flashcard: Flashcard): void {
    const set = this.flashcardSets.find(s => s.id === setId);
    if (set) {
      set.flashcards.push(flashcard);
      this.saveFlashcardSets();
      this.flashcardSets$.next(this.flashcardSets);
    }
  }

  markAsRemembered(setId: string, flashcardId: string): void {
    const set = this.flashcardSets.find(s => s.id === setId);
    if (set) {
      const flashcard = set.flashcards.find(f => f.id === flashcardId);
      if (flashcard) {
        flashcard.remembered = true;
        this.flashcardSets$.next(this.flashcardSets);
      }
    }
  }

  deleteFlashcardSet(setId: string): void {
    this.flashcardSets = this.flashcardSets.filter(set => set.id !== setId);
    this.saveFlashcardSets();
    this.flashcardSets$.next(this.flashcardSets);
  }

  private saveFlashcardSets(): void {
    localStorage.setItem('flashcardSets', JSON.stringify(this.flashcardSets));
  }

  private loadFlashcardSets(): FlashcardSet[] {
    const sets = localStorage.getItem('flashcardSets');
    return sets ? JSON.parse(sets) : [];
  }
}
