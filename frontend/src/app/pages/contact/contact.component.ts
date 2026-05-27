import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in font-sans">
      
      <!-- Page Header -->
      <div class="text-center space-y-4 mb-20">
        <span class="text-xs uppercase font-serif tracking-[0.2em] text-spiritual-gold font-bold">Pilgrim Assistance</span>
        <h1 class="text-4xl sm:text-5xl font-serif font-bold text-spiritual-saffron">Connect With Us</h1>
        <div class="w-16 h-1 bg-spiritual-gold mx-auto rounded-full"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Planning a pilgrimage or seeking spiritual knowledge? Send us an inquiry, and our temple coordinators will connect with you soon.
        </p>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        <!-- Form Area (Left) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md">
          <h2 class="text-2xl font-serif font-bold text-spiritual-saffron mb-6">Send a Spiritual Inquiry</h2>
          
          <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Name -->
              <div class="space-y-1.5">
                <label for="name" class="text-xs font-semibold text-slate-500">Your Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  [(ngModel)]="formData.name"
                  #nameField="ngModel"
                  [ngClass]="{'border-rose-400': nameField.invalid && nameField.touched}"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-spiritual-gold/50 text-sm font-medium transition"
                  placeholder="e.g. Rohan Sharma">
                <p *ngIf="nameField.invalid && nameField.touched" class="text-[10px] text-rose-500 font-semibold">Your name is required</p>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label for="email" class="text-xs font-semibold text-slate-500">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  email
                  [(ngModel)]="formData.email"
                  #emailField="ngModel"
                  [ngClass]="{'border-rose-400': emailField.invalid && emailField.touched}"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-spiritual-gold/50 text-sm font-medium transition"
                  placeholder="e.g. name&#64;domain.com">
                <p *ngIf="emailField.invalid && emailField.touched" class="text-[10px] text-rose-500 font-semibold">Please enter a valid email</p>
              </div>
            </div>

            <!-- Subject -->
            <div class="space-y-1.5">
              <label for="subject" class="text-xs font-semibold text-slate-500">Message Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                required
                [(ngModel)]="formData.subject"
                #subjField="ngModel"
                [ngClass]="{'border-rose-400': subjField.invalid && subjField.touched}"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-spiritual-gold/50 text-sm font-medium transition"
                placeholder="e.g. Group pilgrimage travel guidance">
              <p *ngIf="subjField.invalid && subjField.touched" class="text-[10px] text-rose-500 font-semibold">Subject is required</p>
            </div>

            <!-- Message content -->
            <div class="space-y-1.5">
              <label for="message" class="text-xs font-semibold text-slate-500">Inquiry Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5"
                required
                [(ngModel)]="formData.message"
                #msgField="ngModel"
                [ngClass]="{'border-rose-400': msgField.invalid && msgField.touched}"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-spiritual-gold/50 text-sm font-medium transition"
                placeholder="Write your message here..."></textarea>
              <p *ngIf="msgField.invalid && msgField.touched" class="text-[10px] text-rose-500 font-semibold">Message content cannot be blank</p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="contactForm.invalid || isSubmitting"
              class="w-full sm:w-auto px-8 py-3.5 rounded-full saffron-gradient text-white text-sm font-semibold shadow-md shadow-spiritual-saffron/10 hover:shadow-spiritual-saffron/30 hover:scale-102 transition duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2">
              <span *ngIf="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isSubmitting ? 'Sending inquiry...' : 'Submit Message' }}</span>
            </button>
          </form>
        </div>

        <!-- Contact details / Info (Right) -->
        <div class="space-y-8">
          
          <!-- Office location -->
          <div class="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 class="text-lg font-bold font-serif text-spiritual-gold border-b border-slate-200 dark:border-slate-800 pb-3">Pilgrimage Offices</h3>
            
            <div class="space-y-4 text-xs font-sans">
              <div class="space-y-1">
                <p class="font-bold text-slate-700 dark:text-slate-300">Central Tamil Nadu Ashram Office</p>
                <p class="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  Near Arunachaleswarar Southern Gopuram Gate, Tiruvannamalai, Tamil Nadu - 606601
                </p>
              </div>

              <div class="space-y-1">
                <p class="font-bold text-slate-700 dark:text-slate-300">Working Hours</p>
                <p class="text-slate-500 dark:text-slate-400 font-light">
                  Monday to Saturday: 9:00 AM – 6:00 PM (Indian Standard Time)
                </p>
              </div>

              <div class="space-y-1">
                <p class="font-bold text-slate-700 dark:text-slate-300">E-mail Support</p>
                <p class="text-spiritual-saffron font-semibold">pilgrim.support&#64;panchabhoota.org</p>
              </div>
            </div>
          </div>

          <!-- FAQ Card -->
          <div class="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 class="text-lg font-bold font-serif text-spiritual-gold border-b border-slate-200 dark:border-slate-800 pb-3">Common Travel FAQs</h3>
            
            <div class="space-y-4 text-xs">
              <div class="space-y-1">
                <p class="font-bold text-slate-700 dark:text-slate-300">Q: What is the best sequence to visit the temples?</p>
                <p class="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  A: Traditionally, pilgrims start from Ekambareswarar (Kanchipuram - Earth), proceed to Jambukeswarar (Water), Arunachaleswarar (Fire), Kalahasti (Air), and finish at Chidambaram (Space).
                </p>
              </div>

              <div class="space-y-1">
                <p class="font-bold text-slate-700 dark:text-slate-300">Q: Are there entry fees for holy centers?</p>
                <p class="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  A: Standard darshan is completely free at all five temples. Specialized quick darshan tickets are optionally sold directly by temple boards.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  `
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isSubmitting = true;
    this.apiService.submitContact(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(response.message || 'Message submitted successfully!');
          // Reset form
          form.resetForm();
          this.formData = { name: '', email: '', subject: '', message: '' };
        } else {
          this.toastService.error('Failed to send message, please try again.');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.message || 'Connecting to server failed.');
        this.isSubmitting = false;
      }
    });
  }
}
