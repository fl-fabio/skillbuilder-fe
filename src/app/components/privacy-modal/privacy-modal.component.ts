import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-privacy-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.scss']
})
export class PrivacyModalComponent {
  accepted: boolean = false;
}
