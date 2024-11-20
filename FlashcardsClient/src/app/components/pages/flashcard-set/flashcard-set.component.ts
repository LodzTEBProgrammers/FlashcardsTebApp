import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FlashcardService} from "../../../services/flashcard.service";
import {FlashcardSet} from "../../../interfaces/FlashcardSet";
import {CommonModule} from "@angular/common";
import confetti from 'canvas-confetti';
@Component({
  selector: 'app-flashcard-set',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard-set.component.html',
  styleUrl: './flashcard-set.component.css'
})
export class FlashcardSetComponent implements OnInit {
  flashcardSet: FlashcardSet | undefined;
  flipped: boolean[] = [];
  currentIndex: number = 0;
  knownCards: boolean[] = [];
  showSummary: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const setId = this.route.snapshot.paramMap.get('id');
    this.flashcardService.getFlashcardSets().subscribe(sets => {
      this.flashcardSet = sets.find(set => set.id === setId);
      if (this.flashcardSet) {
        this.flipped = new Array(this.flashcardSet.flashcards.length).fill(false);
        this.knownCards = new Array(this.flashcardSet.flashcards.length).fill(false);
      }
    });
  }

  flipCard() {
    this.flipped[this.currentIndex] = !this.flipped[this.currentIndex];
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      this.flipCard();
    }
  }

  markAsKnown() {
    this.knownCards[this.currentIndex] = true;
    this.nextCard();
  }

  markAsUnknown() {
    this.knownCards[this.currentIndex] = false;
    this.nextCard();
  }

  nextCard() {
    if (this.currentIndex < this.flashcardSet!.flashcards.length - 1) {
      this.currentIndex++;
    } else {
      this.checkCompletion();
    }
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  checkCompletion() {
    if (this.knownCards.every(card => card !== undefined)) {
      this.showSummary = true;
      if (this.knownCards.every(card => card)) {
        this.launchConfetti(); // Launch confetti if all cards are known
      }
    }
  }

  resetFlashcards() {
    this.flipped.fill(false);
    this.knownCards.fill(false);
    this.currentIndex = 0;
    this.showSummary = false;
  }

  getKnownCount(): number {
    return this.knownCards.filter(card => card).length;
  }

  getUnknownCount(): number {
    return this.knownCards.filter(card => !card).length;
  }

  getRemainingCount(): number {
    return this.flashcardSet ? this.flashcardSet.flashcards.length - this.getKnownCount() - this.getUnknownCount() : 0;
  }

  editFlashcardSet() {
    this.router.navigate(['/edit-set', this.flashcardSet?.id]);
  }

  getProgressPercentage(): number {
    const totalCards = this.flashcardSet?.flashcards.length || 0;
    const knownCount = this.getKnownCount();
    return totalCards ? Math.min(Math.round((knownCount / totalCards) * 100), 100) : 0;
  }

  getProgressMessage(): string {
    const progress = this.getProgressPercentage();
    if (progress === 100) {
      return 'Wow, znasz się na rzeczy! Przejrzałeś wszystkie karty.';
    } else if (progress >= 90) {
      return 'Wspaniale! Jesteś blisko osiągnięcia swojego celu.';
    } else if (progress >= 50) {
      return 'Świetnie Ci idzie! Trzymaj tak dalej i buduj pewność siebie.';
    } else if (progress > 0) {
      return 'Doszedłeś do tego miejsca! Oby tak dalej.';
    } else {
      return 'Doszedłeś do tego miejsca! Oby tak dalej.';
    }
  }

  practiceWithQuestions(event: Event) {
    event.preventDefault(); // Prevent default button action
    this.router.navigate(['/practice-questions', this.flashcardSet?.id]);
  }

  launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 }
    });
  }
}
