import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-privacy-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './privacy-modal.component.html',
  styleUrl: './privacy-modal.component.scss'
})
export class PrivacyModalComponent {
  @Input() isVisible: boolean = false;
  @Input() accepted: boolean = false;
  @Output() acceptedChange = new EventEmitter<boolean>();
  @Output() closeRequest = new EventEmitter<void>();

  onToggleAccepted(value: boolean): void {
    this.acceptedChange.emit(value);
  }

  onClose(): void {
    this.closeRequest.emit();
  }
}
