import { Injectable } from '@angular/core';

export interface Toast {
  message: string;
  classname?: string;
  delay?: number;
  autohide?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(message: string, options: { classname?: string; delay?: number } = {}) {
    this.toasts.push({
      message,
      classname: options.classname || '',
      delay: options.delay || 5000,
      autohide: true
    });
  }

  success(message: string) {
    this.show(message, { classname: 'bg-success text-light' });
  }

  error(message: string) {
    this.show(message, { classname: 'bg-danger text-light' });
  }

  info(message: string) {
    this.show(message, { classname: 'bg-info text-light' });
  }

  warning(message: string) {
    this.show(message, { classname: 'bg-warning text-dark' });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}
