import {Component, ElementRef, ViewChild} from '@angular/core';
import {Modal} from "bootstrap";

@Component({
  selector: 'app-dropdown-content-add-folder',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-content.component.html',
  styleUrl: './dropdown-content.component.css'
})
export class DropdownContentComponent {
  @ViewChild('folderName') folderNameInput!: ElementRef;

  openModal() {
    const modalElement = document.getElementById('createFolderModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  addFolder() {
    const folderName = this.folderNameInput.nativeElement.value;

    // Logika dodawania folderu


    console.log('Folder created:', folderName);
  }
}
