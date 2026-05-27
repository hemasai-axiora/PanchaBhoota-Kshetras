import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
      this.isDarkSubject.next(isDark);
      this.applyTheme(isDark);
    }
  }

  toggleTheme() {
    const nextDarkState = !this.isDarkSubject.value;
    this.isDarkSubject.next(nextDarkState);
    if (this.isBrowser) {
      localStorage.setItem('theme', nextDarkState ? 'dark' : 'light');
    }
    this.applyTheme(nextDarkState);
  }

  private applyTheme(isDark: boolean) {
    if (!this.isBrowser) return;

    const htmlEl = document.documentElement;
    if (isDark) {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  }
}
