import {Flashcard} from "./Flashcard";

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  flashcards: Flashcard[];
  createdAt: Date;
}
