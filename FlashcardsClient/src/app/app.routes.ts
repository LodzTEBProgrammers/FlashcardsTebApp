import { Routes } from '@angular/router';
import { FlashcardListComponent } from './components/pages/flashcard-list/flashcard-list.component';
import { FlashcardCreateComponent } from './components/pages/flashcard-create/flashcard-create.component';
import {DropdownContentComponent} from "./components/pages/dropdown-content-add-folder/dropdown-content.component";
import {FolderComponent} from "./components/pages/folder/folder.component";

export const routes: Routes = [
  { path: '', component: FlashcardListComponent },
  { path: 'create', component: FlashcardCreateComponent },
  { path: 'folder/:name', component: FolderComponent },
];
