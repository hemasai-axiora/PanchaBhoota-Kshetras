import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-temple-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-pulse">
      <div class="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-12"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2 space-y-6">
          <div class="h-8 bg-slate-200 dark:bg-slate-800 w-1/2 rounded"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-800 w-5/6 rounded"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-800 w-4/5 rounded"></div>
        </div>
        <div class="space-y-6">
          <div class="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <div *ngIf="!isLoading && temple" class="animate-fade-in font-sans">
      
      <!-- 1. Parallax/Hero Temple Header Banner -->
      <section class="relative h-[60vh] flex items-end bg-slate-950 text-white rounded-b-[2rem] overflow-hidden">
        
        <!-- Large blurred background reference -->
        <div class="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 scale-105" 
             [style.backgroundImage]="'url(' + temple.images[0] + ')'">
        </div>
        
        <!-- Dynamic spiritual background elements glow -->
        <div class="absolute inset-0 bg-gradient-to-t from-spiritual-dark via-spiritual-dark/50 to-transparent"></div>
        
        <!-- Active element specific glow shadow -->
        <div [class]="getElementGlowClass(temple.element)" class="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none"></div>

        <div class="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 z-10 space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Element Indicator -->
            <span [ngClass]="getElementColor(temple.element)" class="px-3.5 py-1 text-xs font-semibold rounded-full border text-white shadow-md uppercase tracking-wider">
              {{ temple.element }} Element
            </span>
            <!-- Sanskrit title -->
            <span class="px-3.5 py-1 text-xs font-semibold rounded-full bg-white/10 text-spiritual-gold border border-spiritual-gold/20">
              Sanskrit: {{ temple.elementSanskrit }}
            </span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-wide text-white leading-tight">
            {{ temple.name }}
          </h1>

          <p class="text-sm text-slate-300 font-medium flex items-center space-x-1.5">
            <svg class="w-4 h-4 text-spiritual-saffron" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
            <span>{{ temple.location }}, {{ temple.state }}, India</span>
          </p>
        </div>
      </section>

      <!-- 2. Detailed Temple Grid Content -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <!-- Column A: Left / Main information area -->
          <div class="lg:col-span-2 space-y-12">
            
            <!-- Intro description -->
            <div class="space-y-4">
              <h2 class="text-2xl font-bold font-serif text-spiritual-saffron border-b border-slate-100 dark:border-slate-800 pb-3">
                Cosmic Significance
              </h2>
              <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {{ temple.description }}
              </p>
            </div>

            <!-- Tabbed panels (History / Powers / Rituals) -->
            <div class="space-y-6">
              <!-- Tab toggles -->
              <div class="flex border-b border-slate-200 dark:border-slate-800 gap-6">
                <button 
                  (click)="activeTab.set('history')"
                  [ngClass]="activeTab() === 'history' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
                  class="pb-3 text-sm font-medium border-b-2 transition duration-200">
                  Sacred History & Legend
                </button>
                <button 
                  (click)="activeTab.set('powers')"
                  [ngClass]="activeTab() === 'powers' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
                  class="pb-3 text-sm font-medium border-b-2 transition duration-200">
                  Spiritual Powers & Worship
                </button>
              </div>

              <!-- Tab Content: History -->
              <div *ngIf="activeTab() === 'history'" class="animate-fade-in text-slate-600 dark:text-slate-300 space-y-4">
                <p class="leading-relaxed font-light text-sm whitespace-pre-line">
                  {{ temple.history }}
                </p>
              </div>

              <!-- Tab Content: Powers -->
              <div *ngIf="activeTab() === 'powers'" class="animate-fade-in space-y-4">
                <p class="text-sm text-slate-500 font-light mb-4">
                  Devotees who complete pujas at this holy element center commonly seek blessings related to:
                </p>
                <ul class="space-y-3.5">
                  <li *ngFor="let power of temple.powers" class="flex items-start space-x-3 text-sm">
                    <span class="w-5 h-5 rounded-full saffron-gradient flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                    <span class="text-slate-600 dark:text-slate-300 font-light leading-normal">{{ power }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Google Map Iframe Embedding -->
            <div class="space-y-4">
              <h2 class="text-xl font-bold font-serif text-spiritual-saffron">Holy Location & Pilgrim Map</h2>
              <div class="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                <iframe 
                  [src]="safeMapUrl" 
                  width="100%" 
                  height="100%" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>

          </div>

          <!-- Column B: Right / Temple Details & Gallery list -->
          <div class="space-y-8">
            
            <!-- Quick Facts Card -->
            <div class="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl space-y-6 shadow-sm">
              <h3 class="text-lg font-bold font-serif text-spiritual-gold border-b border-slate-200 dark:border-slate-800 pb-3">
                Pilgrimage Details
              </h3>
              
              <div class="space-y-4 text-xs font-sans">
                <!-- Main Deity -->
                <div class="flex justify-between items-start py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                  <span class="text-slate-400 font-medium">Main Deity</span>
                  <span class="text-slate-800 dark:text-slate-200 text-right font-bold w-2/3">{{ temple.deity }}</span>
                </div>
                <!-- Consort -->
                <div class="flex justify-between items-start py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                  <span class="text-slate-400 font-medium">Consort</span>
                  <span class="text-slate-800 dark:text-slate-200 text-right font-bold w-2/3">{{ temple.consort }}</span>
                </div>
                <!-- Element -->
                <div class="flex justify-between py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                  <span class="text-slate-400 font-medium">Element represented</span>
                  <span class="text-spiritual-saffron font-bold">{{ temple.element }} ({{ temple.elementSanskrit }})</span>
                </div>
                <!-- Timings -->
                <div class="flex flex-col py-2 border-b border-slate-200/50 dark:border-slate-800/50 space-y-1">
                  <span class="text-slate-400 font-medium">Temple Timings</span>
                  <div class="flex justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    <span>Morning: {{ temple.timings.morning }}</span>
                    <span>Evening: {{ temple.timings.evening }}</span>
                  </div>
                </div>
                <!-- Festivals -->
                <div class="flex flex-col py-2 space-y-2">
                  <span class="text-slate-400 font-medium">Grand Celebrations</span>
                  <div class="flex flex-col space-y-1.5">
                    <span *ngFor="let fest of temple.festivals" class="text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 p-2 rounded text-slate-700 dark:text-slate-300">
                      {{ fest }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Photo Slider / Gallery block -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold font-serif text-spiritual-gold">Sacred Gallery</h3>
              
              <!-- Slider Wrapper -->
              <div class="relative h-60 rounded-2xl overflow-hidden shadow border border-slate-100 dark:border-slate-800">
                <img [src]="temple.images[activeSlideIndex]" [alt]="temple.name" class="w-full h-full object-cover animate-fade-in">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <!-- Left Nav Arrow -->
                <button (click)="prevSlide()" class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition">
                  ⟨
                </button>
                <!-- Right Nav Arrow -->
                <button (click)="nextSlide()" class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition">
                  ⟩
                </button>

                <!-- Indicator dots -->
                <div class="absolute bottom-4 left-0 w-full flex justify-center space-x-1.5">
                  <button 
                    *ngFor="let img of temple.images; let idx = index" 
                    (click)="activeSlideIndex = idx"
                    [class]="activeSlideIndex === idx ? 'bg-spiritual-gold w-4' : 'bg-white/50 w-2'"
                    class="h-2 rounded-full transition-all duration-300"
                    aria-label="Goto slide"></button>
                </div>
              </div>

              <!-- Mini gallery list -->
              <div class="grid grid-cols-3 gap-2">
                <div 
                  *ngFor="let img of temple.images; let idx = index" 
                  (click)="openLightbox(idx)"
                  class="h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition hover:opacity-90"
                  [ngClass]="activeSlideIndex === idx ? 'border-spiritual-gold' : 'border-transparent'">
                  <img [src]="img" class="w-full h-full object-cover">
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- Lightbox Photo Modal Overlay -->
      <div 
        *ngIf="isLightboxOpen" 
        (click)="closeLightbox()"
        class="fixed inset-0 z-[100] flex items-center justify-center lightbox-backdrop animate-fade-in cursor-zoom-out">
        
        <button class="absolute top-6 right-6 text-white text-3xl font-light hover:text-spiritual-saffron transition">&times;</button>
        
        <div class="max-w-4xl max-h-[85vh] p-4 relative" (click)="$event.stopPropagation()">
          <img [src]="temple.images[lightboxIndex]" class="max-w-full max-h-[80vh] rounded-xl object-contain mx-auto shadow-2xl">
          
          <!-- Image Index Indicator -->
          <p class="text-center text-xs text-slate-400 mt-4 tracking-wider uppercase font-medium">
            Image {{ lightboxIndex + 1 }} of {{ temple.images.length }} — {{ temple.name }}
          </p>

          <!-- Navigation inside lightbox -->
          <button (click)="prevLightbox()" class="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition text-xl">⟨</button>
          <button (click)="nextLightbox()" class="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition text-xl">⟩</button>
        </div>
      </div>

    </div>
  `
})
export class TempleDetailComponent implements OnInit {
  isLoading = true;
  temple: any = null;
  safeMapUrl!: SafeResourceUrl;
  
  activeTab = signal<'history' | 'powers'>('history');
  activeSlideIndex = 0;
  
  isLightboxOpen = false;
  lightboxIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const templeId = params.get('id');
      if (templeId) {
        this.fetchTempleDetails(templeId);
      }
    });
  }

  fetchTempleDetails(id: string) {
    this.isLoading = true;
    this.apiService.getTempleById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.temple = response.data;
          // Bypass security configuration for maps iframe
          this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.temple.mapUrl);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  prevSlide() {
    this.activeSlideIndex = (this.activeSlideIndex - 1 + this.temple.images.length) % this.temple.images.length;
  }

  nextSlide() {
    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.temple.images.length;
  }

  openLightbox(idx: number) {
    this.lightboxIndex = idx;
    this.isLightboxOpen = true;
  }

  closeLightbox() {
    this.isLightboxOpen = false;
  }

  prevLightbox() {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.temple.images.length) % this.temple.images.length;
  }

  nextLightbox() {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.temple.images.length;
  }

  getElementColor(element: string): string {
    switch (element) {
      case 'Earth': return 'bg-amber-800/80 border-amber-600/30';
      case 'Water': return 'bg-blue-600/80 border-blue-500/30';
      case 'Fire': return 'bg-orange-600/80 border-orange-500/30';
      case 'Air': return 'bg-teal-600/80 border-teal-500/30';
      case 'Space': return 'bg-indigo-700/80 border-indigo-600/30';
      default: return 'bg-slate-700/80 border-slate-600/30';
    }
  }

  getElementGlowClass(element: string): string {
    switch (element) {
      case 'Earth': return 'bg-amber-500/10';
      case 'Water': return 'bg-blue-500/10';
      case 'Fire': return 'bg-orange-500/15';
      case 'Air': return 'bg-teal-500/10';
      case 'Space': return 'bg-indigo-500/15';
      default: return 'bg-yellow-500/10';
    }
  }
}
