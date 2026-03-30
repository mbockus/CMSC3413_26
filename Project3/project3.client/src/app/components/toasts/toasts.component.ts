import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="toast.autohide ?? true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      {{ toast.message }}
    </ngb-toast>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1200;
    }
  `]
})
export class ToastsComponent {
  constructor(public toastService: ToastService) {}
}
