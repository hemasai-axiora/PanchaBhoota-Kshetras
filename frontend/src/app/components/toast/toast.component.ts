import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-4 z-50 flex flex-col space-y-3 w-full max-w-sm pointer-events-none">
      <div 
        *ngFor="let toast of toasts$ | async" 
        [ngClass]="getToastClasses(toast.type)"
        class="pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border animate-slide-up transition-all duration-300 transform hover:scale-102"
        role="alert">
        
        <div class="flex items-center space-x-3">
          <!-- Icon -->
          <ng-container [ngSwitch]="toast.type">
            <!-- Success check icon -->
            <svg *ngSwitchCase="'success'" class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
            <!-- Error icon -->
            <svg *ngSwitchCase="'error'" class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <!-- Warning icon -->
            <svg *ngSwitchCase="'warning'" class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <!-- Info icon -->
            <svg *ngSwitchCase="'info'" class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </ng-container>

          <span class="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">
            {{ toast.message }}
          </span>
        </div>

        <button (click)="remove(toast.id)" class="ml-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition-colors duration-150">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

      </div>
    </div>
  `,
  styles: []
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toasts$: Observable<Toast[]> = this.toastService.toasts$;

  ngOnInit() {}

  remove(id: string) {
    this.toastService.remove(id);
  }

  getToastClasses(type: 'success' | 'error' | 'info' | 'warning'): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-50/95 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30';
      case 'error':
        return 'bg-rose-50/95 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30';
      case 'warning':
        return 'bg-amber-50/95 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30';
      case 'info':
        return 'bg-blue-50/95 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30';
      default:
        return 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800';
    }
  }
}
