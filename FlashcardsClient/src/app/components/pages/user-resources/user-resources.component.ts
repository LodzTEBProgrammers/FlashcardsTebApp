import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FlashcardService} from "../../../services/flashcard.service";
import {CommonModule, DatePipe} from "@angular/common";
import {FlashcardSet} from "../../../interfaces/FlashcardSet";
import {Router, RouterLink, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AccountUser} from "../../../models/account-user";
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-user-resources',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule
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

  users: AccountUser[] = [];

  private accountService = inject(AccountService);

  @ViewChild('leftLink') leftLink!: ElementRef;
  @ViewChild('rightLink') rightLink!: ElementRef;
  constructor(private flashcardService: FlashcardService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
    this.flashcardService.getFlashcardSets().subscribe(sets => {
      this.flashcardSets = sets;
    });
  }

  loadUsers(){
    this.accountService.getUsers().subscribe((response: AccountUser[]) => {
      this.users = response;
    });
  }

  // When refresh button is clicked, execute
  refreshClicked() {
    this.accountService.postGenerateNewToken().subscribe({
      next: (response: any) => {
        localStorage["token"] = response.token;
        localStorage["refreshToken"] = response.refreshToken;

        this.loadUsers();
      },
      error: (err: any) => (console.log(err))
    })
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
}
