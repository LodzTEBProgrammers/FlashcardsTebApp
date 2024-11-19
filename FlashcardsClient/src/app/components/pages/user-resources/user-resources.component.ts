import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FlashcardService} from "../../../services/flashcard.service";
import {CommonModule, DatePipe} from "@angular/common";
import {FlashcardSet} from "../../../interfaces/FlashcardSet";
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-resources',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-resources.component.html',
  styleUrl: './user-resources.component.css'
})
export class UserResourcesComponent implements OnInit, AfterViewInit {
  flashcardSets: FlashcardSet[] = [];
  selectedOption: string = 'created';
  searchQuery: string = '';
  isLeftActive: boolean = false;
  isRightActive: boolean = false;
  leftBorderWidth: number = 0;
  rightBorderWidth: number = 0;

  @ViewChild('leftLink') leftLink!: ElementRef;
  @ViewChild('rightLink') rightLink!: ElementRef;
  constructor(private flashcardService: FlashcardService, private router: Router) {}

  ngOnInit() {
    this.flashcardService.getFlashcardSets().subscribe(sets => {
      this.flashcardSets = sets;
    });
  }

  ngAfterViewInit() {
    this.leftBorderWidth = this.leftLink.nativeElement.offsetWidth;
    this.rightBorderWidth = this.rightLink.nativeElement.offsetWidth;
  }

  setActive(side: string, state: boolean, event: MouseEvent) {
    const target = event.target as HTMLElement;
    const width = target.offsetWidth;

    if (side === 'left') {
      this.isLeftActive = state;
      this.leftBorderWidth = width;
    } else if (side === 'right') {
      this.isRightActive = state;
      this.rightBorderWidth = width;
    }
  }

  onOptionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedOption = selectElement.value;
  }

  onSearch() {
    // Implement search logic here
  }

  openSet(setId: string) {
    this.router.navigate(['/set', setId]);
  }
}
