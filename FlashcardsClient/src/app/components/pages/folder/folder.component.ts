import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent {
  folderName: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.folderName = this.route.snapshot.paramMap.get('name');
  }
}
