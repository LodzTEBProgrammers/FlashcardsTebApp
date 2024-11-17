import { Routes } from '@angular/router';
import { FlashcardListComponent } from './components/flashcard-list/flashcard-list.component';
import { FlashcardCreateComponent } from './components/flashcard-create/flashcard-create.component';

export const routes: Routes = [
  { path: '', component: FlashcardListComponent },
  { path: 'create', component: FlashcardCreateComponent }
];
