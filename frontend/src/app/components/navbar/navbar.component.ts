import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed top-0 left-0 w-full z-50 glass-nav transition-all duration-300" [ngClass]="{'nav-scrolled': isScrolled}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo Section -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <span class="text-2xl font-bold tracking-wider text-spiritual-saffron font-serif hover:text-spiritual-gold transition duration-300">
                YATRA
              </span>
              <span class="hidden md:inline text-xs border border-spiritual-gold px-1.5 py-0.5 rounded text-spiritual-gold uppercase font-semibold">
                Sacred Yatras
              </span>
            </a>
          </div>

          <!-- Main Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8">
            <a routerLink="/" routerLinkActive="text-spiritual-saffron font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-sm font-medium hover:text-spiritual-saffron transition duration-300">Home</a>
            <a routerLink="/temples" routerLinkActive="text-spiritual-saffron font-semibold" class="text-sm font-medium hover:text-spiritual-saffron transition duration-300">Temples</a>
            <a routerLink="/gallery" routerLinkActive="text-spiritual-saffron font-semibold" class="text-sm font-medium hover:text-spiritual-saffron transition duration-300">Gallery</a>
            <a routerLink="/about" routerLinkActive="text-spiritual-saffron font-semibold" class="text-sm font-medium hover:text-spiritual-saffron transition duration-300">About</a>
            <a routerLink="/booking" routerLinkActive="text-spiritual-saffron font-semibold" class="text-sm font-medium hover:text-spiritual-saffron transition duration-300">Book Yatra</a>
            <a routerLink="/track" routerLinkActive="text-spiritual-saffron font-semibold" class="text-sm font-medium hover:text-spiritual-saffron transition duration-300">Track Trip</a>
            <a routerLink="/contact" routerLinkActive="text-spiritual-saffron font-semibold" class="text-sm font-medium hover:text-spiritual-saffron transition duration-300">Contact</a>
            
            <ng-container *ngIf="admin$ | async as admin">
              <a routerLink="/admin/dashboard" routerLinkActive="text-spiritual-gold font-semibold" class="text-sm font-medium text-spiritual-gold hover:text-spiritual-saffron transition duration-300">Dashboard</a>
            </ng-container>
          </div>

          <!-- Theme & Auth Controls -->
          <div class="hidden lg:flex items-center space-x-4">
            
            <!-- Dark Mode Toggle Button -->
            <button (click)="toggleTheme()" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 text-spiritual-gold" aria-label="Toggle Theme">
              <ng-container *ngIf="isDarkMode$ | async; else lightIcon">
                <!-- Sun Icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0A9 9 0 115.636 5.636m12.728 12.728A9 9 0 015.636 5.636"></path>
                </svg>
              </ng-container>
              <ng-template #lightIcon>
                <!-- Moon Icon -->
                <svg class="w-5 h-5" fill="currentColor" stroke="none" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              </ng-template>
            </button>

            <!-- Admin Action Button -->
            <ng-container *ngIf="admin$ | async as admin; else loginBtn">
              <button (click)="logout()" class="px-4 py-2 text-xs font-semibold rounded-full border border-spiritual-saffron text-spiritual-saffron hover:bg-spiritual-saffron hover:text-white transition duration-300">
                Logout
              </button>
            </ng-container>
            <ng-template #loginBtn>
              <a routerLink="/admin/login" class="px-4 py-2 text-xs font-semibold rounded-full saffron-gradient text-white hover:opacity-90 transition duration-300">
                Admin Area
              </a>
            </ng-template>
          </div>

          <!-- Mobile Menu Button -->
          <div class="flex items-center lg:hidden space-x-3">
            
            <!-- Dark Mode Toggle Mobile -->
            <button (click)="toggleTheme()" class="p-2 rounded-full text-spiritual-gold hover:bg-black/5 dark:hover:bg-white/5" aria-label="Toggle Theme Mobile">
              <ng-container *ngIf="isDarkMode$ | async; else lightIcon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0A9 9 0 115.636 5.636m12.728 12.728A9 9 0 015.636 5.636"></path></svg>
              </ng-container>
            </button>

            <!-- Menu trigger -->
            <button (click)="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition duration-300" aria-label="Toggle Menu">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
              </svg>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Sidebar Menu Overlay -->
      <div class="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-spiritual-dark shadow-xl transition-all duration-300 ease-in-out border-b border-spiritual-gold/10" [ngClass]="isMobileMenuOpen ? 'block max-h-screen opacity-100 py-6' : 'hidden max-h-0 opacity-0'">
        <div class="px-4 space-y-4">
          <a routerLink="/" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium border-b border-gray-100 dark:border-gray-800">Home</a>
          <a routerLink="/temples" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium border-b border-gray-100 dark:border-gray-800">Temples</a>
          <a routerLink="/gallery" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium border-b border-gray-100 dark:border-gray-800">Gallery</a>
          <a routerLink="/about" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium border-b border-gray-100 dark:border-gray-800">About</a>
          <a routerLink="/booking" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium border-b border-gray-100 dark:border-gray-800">Book Yatra</a>
          <a routerLink="/track" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium border-b border-gray-100 dark:border-gray-800 font-semibold text-spiritual-saffron">Track Trip</a>
          <a routerLink="/contact" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium border-b border-gray-100 dark:border-gray-800">Contact</a>
          
          <ng-container *ngIf="admin$ | async as admin">
            <a routerLink="/admin/dashboard" (click)="isMobileMenuOpen = false" class="block py-2 text-base font-medium text-spiritual-gold border-b border-gray-100 dark:border-gray-800">Dashboard</a>
          </ng-container>

          <div class="pt-2 flex items-center justify-between">
            <ng-container *ngIf="admin$ | async as admin; else mobileLogin">
              <button (click)="logout(); isMobileMenuOpen = false" class="w-full py-2.5 text-center text-sm font-semibold rounded-full border border-spiritual-saffron text-spiritual-saffron">
                Logout
              </button>
            </ng-container>
            <ng-template #mobileLogin>
              <a routerLink="/admin/login" (click)="isMobileMenuOpen = false" class="w-full block py-2.5 text-center text-sm font-semibold rounded-full saffron-gradient text-white">
                Admin Area
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isScrolled = false;
  isMobileMenuOpen = false;
  isDarkMode$ = this.themeService.isDarkMode$;
  admin$ = this.authService.currentAdmin$;

  ngOnInit() {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
