import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(title: string, message?: string, type: ToastMessage['type'] = 'info') {
    const id = Math.random().toString(36).substr(2, 9);
    this._toasts.update(t => [...t, { id, title, message, type }]);
    
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  success(title: string, message?: string) { this.show(title, message, 'success'); }
  error(title: string, message?: string) { this.show(title, message, 'error'); }
  warning(title: string, message?: string) { this.show(title, message, 'warning'); }
  info(title: string, message?: string) { this.show(title, message, 'info'); }

  remove(id: string) {
    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
