import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[75vh] flex items-center justify-center px-4 py-16 animate-fade-in font-sans">
      
      <div class="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
        
        <!-- Subtle saffron decorative lines -->
        <div class="absolute top-0 left-0 w-full h-1.5 saffron-gradient"></div>

        <div class="text-center space-y-2">
          <span class="text-3xl text-spiritual-gold">ॐ</span>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold tracking-wide">Admin Control Center</h1>
          <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Authorized Personnel Only</p>
        </div>

        <form #loginForm="ngForm" (ngSubmit)="onLogin(loginForm)" class="space-y-6">
          
          <!-- Email field -->
          <div class="space-y-1.5">
            <label for="email" class="text-xs font-semibold text-slate-500">Administrator Email</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                👤
              </span>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                email
                [(ngModel)]="email"
                #emailRef="ngModel"
                [ngClass]="{'border-rose-400': emailRef.invalid && emailRef.touched}"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-spiritual-gold/50 font-medium transition"
                placeholder="admin&#64;panchabhoota.org">
            </div>
            <p *ngIf="emailRef.invalid && emailRef.touched" class="text-[10px] text-rose-500 font-semibold">Enter a valid admin email</p>
          </div>

          <!-- Password field -->
          <div class="space-y-1.5">
            <label for="password" class="text-xs font-semibold text-slate-500">Secure Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                🔒
              </span>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required
                [(ngModel)]="password"
                #passRef="ngModel"
                [ngClass]="{'border-rose-400': passRef.invalid && passRef.touched}"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-spiritual-gold/50 font-medium transition"
                placeholder="••••••••">
            </div>
            <p *ngIf="passRef.invalid && passRef.touched" class="text-[10px] text-rose-500 font-semibold">Password is required</p>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading"
            class="w-full py-3.5 saffron-gradient text-white text-sm font-semibold rounded-full shadow-md shadow-spiritual-saffron/10 hover:shadow-spiritual-saffron/30 hover:scale-102 transition duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2">
            <span *ngIf="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isLoading ? 'Verifying session...' : 'Access Dashboard' }}</span>
          </button>
        </form>

        <!-- Back to home -->
        <div class="text-center pt-2">
          <a routerLink="/" class="text-xs text-slate-400 hover:text-spiritual-saffron transition">
            ← Return to Holy Homepage
          </a>
        </div>

      </div>

    </div>
  `
})
export class AdminLoginComponent implements OnInit {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    // If already logged in, skip to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    const creds = { email: this.email, password: this.password };

    this.authService.login(creds).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(`Welcome back, ${response.admin.username}! Access granted.`);
          this.router.navigate(['/admin/dashboard']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.message || 'Invalid administrator credentials.');
        this.isLoading = false;
      }
    });
  }
}
