import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
})
export class CommonDialogComponent {
  @Input() title: string = '';
  @Input() show: boolean = false;
  @Input() width: string = '54vw';
  @Input() maxWidth: string = '1000px';
  @Input() maxHeight: string = '95vh';
  @Input() showClose: boolean = true;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
