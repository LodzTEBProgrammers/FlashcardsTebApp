import {ChangeDetectorRef, Component, HostListener, OnInit, ChangeDetectionStrategy} from '@angular/core';
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
  styleUrl: './flashcard-set.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlashcardSetComponent implements OnInit {
  flashcardSet: FlashcardSet | undefined;
  flipped: boolean[] = [];
  currentIndex: number = 0;
  knownCards: boolean[] = [];
  showSummary: boolean = false;
  feedbackMessage: string = '';
  feedbackClass: string = '';
  loading: boolean = false; // Add loading state
  narratorEnabled: boolean = false; // Add narrator state
  dropdownOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
  }

  ngOnInit() {
    const setId = this.route.snapshot.paramMap.get('id');
    this.flashcardService.getFlashcardSets().subscribe(sets => {
      this.flashcardSet = sets.find(set => set.id === setId);
      if (this.flashcardSet) {
        this.flipped = new Array(this.flashcardSet.flashcards.length).fill(false);
        this.knownCards = new Array(this.flashcardSet.flashcards.length).fill(false);
        this.cdr.markForCheck();
      }
    });
  }

  flipCard() {
    this.flipped[this.currentIndex] = !this.flipped[this.currentIndex];
    this.cdr.markForCheck();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.loading) return; // Prevent action if loading

    switch (event.key) {
      case 'ArrowDown':
        this.previousFlashcard();
        this.highlightButton('previous');
        break;
      case 'ArrowRight':
        this.markAsKnown();
        this.highlightButton('known');
        break;
      case 'ArrowLeft':
        this.markAsUnknown();
        this.highlightButton('unknown');
        break;
      case 'ArrowUp':
        this.resetFlashcards();
        this.highlightButton('reset');
        break;
      case ' ':
        this.flipCard();
        break;
    }
  }

  markAsKnown() {
    if (this.loading) return; // Prevent action if loading
    this.knownCards[this.currentIndex] = true;
    this.showFeedback('Umiem', 'known');
    this.loading = true;
    setTimeout(() => {
      this.nextCard();
      this.loading = false;
    }, 1000); // Add delay
  }

  markAsUnknown() {
    if (this.loading) return; // Prevent action if loading
    this.knownCards[this.currentIndex] = false;
    this.showFeedback('Wciąż się uczę', 'unknown');
    this.loading = true;
    setTimeout(() => {
      this.nextCard();
      this.loading = false;
    }, 1000); // Add delay
  }

  nextCard() {
    if (this.currentIndex < this.flashcardSet!.flashcards.length - 1) {
      this.currentIndex++;
    } else {
      this.checkCompletion();
    }
    this.cdr.markForCheck();
  }

  previousFlashcard() {
    if (this.loading) return; // Prevent action if loading
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.cdr.markForCheck();
  }

  checkCompletion() {
    if (this.knownCards.every(card => card !== undefined)) {
      this.showSummary = true;
      if (this.knownCards.every(card => card)) {
        this.launchConfetti(); // Launch confetti if all cards are known
      }
      this.cdr.markForCheck();
    }
  }

  resetFlashcards() {
    this.flipped.fill(false);
    this.knownCards.fill(false);
    this.currentIndex = 0;
    this.showSummary = false;
    this.cdr.markForCheck();
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
      origin: {x: 0.5, y: 0.5}
    });
  }

  showFeedback(message: string, cssClass: string) {
    this.feedbackMessage = message;
    this.feedbackClass = cssClass;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.feedbackMessage = '';
      this.feedbackClass = '';
      this.cdr.detectChanges();
    }, 1000);
  }


  highlightButton(buttonType: 'previous' | 'known' | 'unknown' | 'reset') {
    const buttons: { [key in 'previous' | 'known' | 'unknown' | 'reset']: string } = {
      previous: 'btn-previous',
      known: 'btn-known',
      unknown: 'btn-unknown',
      reset: 'btn-reset'
    };

    const button = document.querySelector(`.${buttons[buttonType]}`);
    if (button) {
      button.classList.add('highlight');
    }

    setTimeout(() => {
      if (button) {
        button.classList.remove('highlight');
      }
    }, 800); // Adjust the delay to match the loading time
  }

  toggleNarrator() {
    this.narratorEnabled = !this.narratorEnabled;
    if (this.narratorEnabled) {
      this.readFlashcard();
    } else {
      speechSynthesis.cancel(); // Stop any ongoing speech
    }

  }

  readFlashcard(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent the click event from propagating
    }
    if (!this.flashcardSet) return;
    const textToRead = this.flipped[this.currentIndex]
      ? this.flashcardSet.flashcards[this.currentIndex].definition
      : this.flashcardSet.flashcards[this.currentIndex].term;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pl-PL'; // Set language to Polish
    speechSynthesis.speak(utterance);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  addToFolder() {
    // Implement the logic for adding to folder
  }

  saveAndEdit() {
    // Implement the logic for saving and editing
  }

  print() {
    // Implement the logic for printing
  }

  connect() {
    // Implement the logic for connecting
  }

  export() {
    // Implement the logic for exporting
  }

  embed() {
    // Implement the logic for embedding
  }

  deleteSet() {
    if (confirm('Czy na pewno chcesz usunąć ten zestaw fiszek?')) {
      this.loading = true;
      this.flashcardService.deleteFlashcardSet(this.flashcardSet!.id);
      this.loading = false;
      this.router.navigate(['/resources']);
    }
  }
}
