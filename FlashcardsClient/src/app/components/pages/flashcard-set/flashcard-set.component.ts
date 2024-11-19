import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FlashcardService} from "../../../services/flashcard.service";
import {FlashcardSet} from "../../../interfaces/FlashcardSet";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-flashcard-set',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard-set.component.html',
  styleUrl: './flashcard-set.component.css'
})
export class FlashcardSetComponent implements OnInit {
  flashcardSet: FlashcardSet | undefined;

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService
  ) {
  }

  ngOnInit() {
    const setId = this.route.snapshot.paramMap.get('id');
    this.flashcardService.getFlashcardSets().subscribe(sets => {
      this.flashcardSet = sets.find(set => set.id === setId);
    });
  }
}
