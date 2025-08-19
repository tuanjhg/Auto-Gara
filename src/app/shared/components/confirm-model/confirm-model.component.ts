import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-model',
  templateUrl: './confirm-model.component.html',
  styleUrls: ['./confirm-model.component.scss']
})
export class ConfirmModelComponent {
  @Input() open = false;
  @Input() title;
  @Input() message;
  @Input() confirmText;
  @Input() cancelText;
  @Input() confirmClass = 'bg-red-500 hover:bg-red-600 text-white';
  @Input() cancelClass = 'bg-gray-200 hover:bg-gray-300 text-gray-900';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  confirm(): void {
    this.confirmed.emit();
  }
  cancel(): void {
    this.cancelled.emit();
  }

}
