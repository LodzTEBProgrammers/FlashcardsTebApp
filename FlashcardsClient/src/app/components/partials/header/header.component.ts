import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {Modal} from "bootstrap";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('folderName') folderNameInput!: ElementRef;
  isDropdownOpen = false;
  private modal: Modal | null = null;

  constructor(private router: Router) {}

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openFlashcardsSet() {
   this.router.navigate(['/create']);
   this.closeDropdown();
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.closeDropdown();
  }

  openModal() {
    const modalElement = document.getElementById('createFolderModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  addFolder() {
    const folderName = this.folderNameInput.nativeElement.value;
    // Logic for adding folder
    console.log('Folder created:', folderName);

    // Close the modal if added successfully
    const modalElement = document.getElementById('createFolderModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }

    // Navigate to the newly created folder and refresh the page
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/folder', folderName]);
    });
  }
}
