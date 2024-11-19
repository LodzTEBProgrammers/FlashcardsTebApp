import { Routes } from '@angular/router';
import { FlashcardCreateComponent } from './components/pages/flashcard-create/flashcard-create.component';
import {FolderComponent} from "./components/pages/folder/folder.component";
import {FlashcardSetComponent} from "./components/pages/flashcard-set/flashcard-set.component";
import {UserResourcesComponent} from "./components/pages/user-resources/user-resources.component";
import {HomePageComponent} from "./components/pages/home-page/home-page.component";

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'create', component: FlashcardCreateComponent },
  { path: 'folder/:name', component: FolderComponent },
  { path: 'set/:id', component: FlashcardSetComponent },
  { path: 'resources', component: UserResourcesComponent },

];
