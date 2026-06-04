import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-trip-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in font-sans">
      
      <!-- Page Header -->
      <div class="text-center space-y-3 mb-12">
        <span class="text-xs uppercase font-serif tracking-[0.2em] text-spiritual-gold font-bold">Pilgrimage Monitoring</span>
        <h1 class="text-4xl font-serif font-bold text-spiritual-saffron">Yatra Live Tracking</h1>
        <div class="w-12 h-1 bg-spiritual-gold mx-auto rounded-full"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Input your Reference ID and contact details to track your sacred yatra status and live GPS location.
        </p>
      </div>

      <!-- Lookup Form Section -->
      <div class="max-w-xl mx-auto bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg mb-12">
        <form (ngSubmit)="onTrack()" class="space-y-4 text-xs font-medium">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="searchId" class="text-slate-400">Booking Reference ID</label>
              <input type="text" id="searchId" name="searchId" required [(ngModel)]="searchData.bookingId"
                     class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs"
                     placeholder="e.g. 5x7f8a9">
            </div>

            <div class="space-y-1">
              <label for="contactDetail" class="text-slate-400">Email or Phone Number</label>
              <input type="text" id="contactDetail" name="contactDetail" required [(ngModel)]="searchData.contact"
                     class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs"
                     placeholder="Your email or phone">
            </div>
          </div>

          <button type="submit" [disabled]="!searchData.bookingId || !searchData.contact || isSearching"
                  class="w-full sm:w-auto px-6 py-2.5 rounded-full saffron-gradient text-white text-xs font-semibold shadow hover:scale-102 transition duration-200 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-1.5">
            <span *ngIf="isSearching" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isSearching ? 'Fetching live details...' : 'Track My Yatra' }}</span>
          </button>
        </form>
      </div>

      <!-- Tracking Results Section -->
      <div *ngIf="trackingResult" class="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        <!-- Yatra Status Overview -->
        <div class="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 saffron-gradient"></div>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider text-white saffron-gradient">
                Yatra: {{ trackingResult.status }}
              </span>
              <h2 class="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100">{{ trackingResult.packageName }}</h2>
              <div class="text-xs text-slate-400 font-light flex flex-wrap gap-x-4 gap-y-1">
                <span>👤 Pilgrims: <strong>{{ trackingResult.pilgrimsCount }}</strong></span>
                <span>📅 Start Date: <strong>{{ trackingResult.startDate | date:'fullDate' }}</strong></span>
                <span>🎫 Ref ID: <strong class="select-all font-mono text-spiritual-gold">{{ trackingResult._id }}</strong></span>
              </div>
            </div>

            <!-- Current Level Box -->
            <div class="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center min-w-[200px] flex flex-col justify-center">
              <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Current Progress Stage</span>
              <span class="text-base font-serif font-bold text-spiritual-saffron mt-1">{{ trackingResult.currentLevel }}</span>
            </div>
          </div>
        </div>

        <!-- Level Stepper Timeline -->
        <div class="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md">
          <h3 class="text-lg font-serif font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center space-x-2">
            <span>🗺️</span> <span>Yatra Journey Timeline</span>
          </h3>

          <div class="flex flex-col md:flex-row items-center justify-between relative gap-6">
            
            <!-- Progress Line (Desktop only) -->
            <div class="hidden md:block absolute left-8 right-8 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0">
              <div class="h-full saffron-gradient transition-all duration-500" [style.width.%]="getProgressPercent()"></div>
            </div>

            <!-- Stepper Nodes -->
            <div *ngFor="let step of yatraStages; let idx = index" 
                 class="flex flex-col items-center text-center relative z-10 space-y-2 md:w-1/5">
              
              <!-- Icon/Node Point -->
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition duration-300"
                   [ngClass]="getStepClass(idx)">
                {{ getStepMark(idx) }}
              </div>
              
              <!-- Label -->
              <div class="space-y-0.5">
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ step }}</p>
                <p class="text-[9px] text-slate-400" *ngIf="isCurrentStep(idx)">Currently Here</p>
              </div>

            </div>
          </div>
        </div>

        <!-- Live GPS Map & Tracking Remarks -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Live Remarks & Tracking Metadata -->
          <div class="lg:col-span-5 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <h3 class="text-lg font-serif font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>📍</span> <span>GPS Live Position</span>
              </h3>
              
              <div class="space-y-3 text-xs">
                <div class="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span class="text-slate-400">Current City:</span>
                  <span class="font-bold text-spiritual-saffron">{{ trackingResult.liveTracking.currentCity }}</span>
                </div>
                <div class="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span class="text-slate-400">Coordinates:</span>
                  <span class="font-semibold text-slate-700 dark:text-slate-300">
                    {{ trackingResult.liveTracking.latitude | number:'1.4-4' }}, {{ trackingResult.liveTracking.longitude | number:'1.4-4' }}
                  </span>
                </div>
                <div class="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span class="text-slate-400">Last GPS Ping:</span>
                  <span class="text-slate-500 font-light">
                    {{ trackingResult.liveTracking.lastUpdated | date:'medium' }}
                  </span>
                </div>
              </div>

              <!-- Remarks / Log Message -->
              <div class="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 text-xs">
                <span class="font-bold text-spiritual-gold block mb-1">Coordinator Notes</span>
                <p class="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  {{ trackingResult.liveTracking.remarks }}
                </p>
              </div>
            </div>

            <!-- Contact support notice -->
            <p class="text-[10px] text-slate-400 text-center italic">
              Need assistance? Contact our 24/7 Yatra Support Helpline: 📞 +91 98765 43210
            </p>
          </div>

          <!-- Map Embed Frame -->
          <div class="lg:col-span-7 bg-white dark:bg-slate-950 p-3 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md h-96 overflow-hidden">
            <iframe 
              width="100%" 
              height="100%" 
              style="border: 0; border-radius: 20px;" 
              loading="lazy" 
              allowfullscreen 
              [src]="getMapUrl()">
            </iframe>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: []
})
export class TripTrackingComponent implements OnInit {
  isSearching = false;
  trackingResult: any = null;

  searchData = {
    bookingId: '',
    contact: ''
  };

  // General milestones for journey stepper
  yatraStages = [
    'Confirmed',
    'Departure',
    'Yatra Active',
    'Final Darshan',
    'Completed'
  ];

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  onTrack() {
    this.isSearching = true;
    this.trackingResult = null;

    const contactStr = this.searchData.contact.trim();
    // detect if email or phone
    const isEmail = contactStr.includes('@');
    const email = isEmail ? contactStr : '';
    const phone = isEmail ? '' : contactStr;
    const bookingId = this.searchData.bookingId.trim();

    this.apiService.trackBooking(email, phone, bookingId).subscribe({
      next: (res) => {
        if (res.success) {
          this.trackingResult = res.data;
          this.toastService.success('Yatra live details synced successfully!');
        } else {
          this.toastService.error('Yatra details not found.');
        }
        this.isSearching = false;
      },
      error: (err) => {
        this.toastService.error(err.message || 'Details lookup failed. Verify credentials.');
        this.isSearching = false;
      }
    });
  }

  // Get index of the current stage
  getCurrentStageIdx(): number {
    if (!this.trackingResult) return 0;
    const currentLvl = this.trackingResult.currentLevel.toLowerCase();
    
    if (currentLvl.includes('complete')) {
      return 4;
    } else if (currentLvl.includes('final') || currentLvl.includes('darshan') || currentLvl.includes('space') || currentLvl.includes('badrinath') || currentLvl.includes('purification')) {
      return 3;
    } else if (currentLvl.includes('active') || currentLvl.includes('en route') || currentLvl.includes('visited') || currentLvl.includes('element')) {
      return 2;
    } else if (currentLvl.includes('departure') || currentLvl.includes('started') || currentLvl.includes('dispatch')) {
      return 1;
    }
    return 0; // Booking Confirmed
  }

  getProgressPercent(): number {
    const idx = this.getCurrentStageIdx();
    return idx * 25; // 0, 25, 50, 75, 100
  }

  getStepClass(idx: number): { [key: string]: boolean } {
    const currentIdx = this.getCurrentStageIdx();
    return {
      'bg-spiritual-saffron text-white shadow-md': idx === currentIdx,
      'bg-emerald-500 text-white': idx < currentIdx,
      'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600': idx > currentIdx
    };
  }

  getStepMark(idx: number): string {
    const currentIdx = this.getCurrentStageIdx();
    if (idx < currentIdx) return '✓';
    return (idx + 1).toString();
  }

  isCurrentStep(idx: number): boolean {
    return idx === this.getCurrentStageIdx();
  }

  getMapUrl(): SafeResourceUrl {
    if (!this.trackingResult || !this.trackingResult.liveTracking) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }
    const lat = this.trackingResult.liveTracking.latitude || 20.5937;
    const lng = this.trackingResult.liveTracking.longitude || 78.9629;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=10&output=embed`);
  }
}
