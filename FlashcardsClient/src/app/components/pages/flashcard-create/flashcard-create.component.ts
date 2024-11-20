import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FlashcardService} from "../../../services/flashcard.service";
import {Flashcard} from "../../../interfaces/Flashcard";
import { v4 as uuidv4 } from 'uuid';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {FlashcardSet} from "../../../interfaces/FlashcardSet";

@Component({
  selector: 'app-flashcard-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './flashcard-create.component.html',
  styleUrl: './flashcard-create.component.css'
})
export class FlashcardCreateComponent implements OnInit {
  flashcards: Flashcard[] = [];
  title: string = '';
  description: string = '';

  constructor(private flashcardService: FlashcardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Initialize flashcards if needed
    if (this.flashcards.length === 0) {
      this.addFlashcard();
    }
  }

  addFlashcard() {
    const newFlashcard: Flashcard = {
      id: uuidv4(),
      term: '',
      definition: '',
      remembered: false
    };
    this.flashcards.push(newFlashcard);
  }

  removeFlashcard(index: number) {
    this.flashcards.splice(index, 1);
  }

  trackById(index: number, flashcard: Flashcard): string {
    return flashcard.id;
  }

  createSet() {
    if (this.title.trim() === '') {
      alert('Tytuł nie może być pusty');
      return;
    }

    const newSet: FlashcardSet = {
      id: uuidv4(),
      title: this.title,
      description: this.description,
      flashcards: this.flashcards,
      createdAt: new Date(),
      termCount: this.flashcards.length, // Add this line
      username: 'nic00la1' // Add this line, replace with actual username
    };
    this.flashcardService.addFlashcardSet(newSet);
    this.cdr.detectChanges(); // Manually trigger change detection
  }
}
