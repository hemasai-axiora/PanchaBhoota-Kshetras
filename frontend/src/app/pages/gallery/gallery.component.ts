import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in font-sans">
      
      <!-- Page Header -->
      <div class="text-center space-y-4 mb-16">
        <span class="text-xs uppercase font-serif tracking-[0.2em] text-spiritual-gold font-bold">Divine Visual Glimpses</span>
        <h1 class="text-4xl sm:text-5xl font-serif font-bold text-spiritual-saffron">The Sacred Gallery</h1>
        <div class="w-16 h-1 bg-spiritual-gold mx-auto rounded-full"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Marvel at the breathtaking architecture and spiritual spaces representing Earth, Water, Fire, Air, and Space. Click on any visual capture to enter full-screen contemplation.
        </p>
      </div>

      <!-- Category Filter Tags -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button 
          *ngFor="let tab of tabs" 
          (click)="filterGallery(tab)"
          [ngClass]="activeFilter === tab ? 'saffron-gradient text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-spiritual-gold'"
          class="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition duration-300">
          {{ tab }}
        </button>
      </div>

      <!-- Loading skeleton -->
      <div *ngIf="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div *ngFor="let s of [1,2,3,4,5,6]" class="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Masonry Gallery Grid -->
      <div *ngIf="!isLoading && filteredGallery.length > 0" class="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        <div 
          *ngFor="let img of filteredGallery; let idx = index" 
          (click)="openLightbox(idx)"
          class="break-inside-avoid relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 dark:border-slate-800/80 group cursor-zoom-in transition-all duration-300 transform hover:-translate-y-1">
          
          <!-- Image -->
          <img [src]="img.url" [alt]="img.title" class="w-full object-cover rounded-2xl">
          
          <!-- Dark Overlay on Hover -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
            <span class="inline-block text-[10px] font-semibold bg-spiritual-saffron text-white px-2 py-0.5 rounded uppercase self-start mb-2">
              {{ img.element }} Element
            </span>
            <h3 class="text-sm font-bold font-serif text-white">{{ img.templeName }}</h3>
            <p class="text-xs text-slate-300 font-light mt-1 line-clamp-2">{{ img.description }}</p>
          </div>

        </div>
      </div>

      <!-- Lightbox Contemplative Slider -->
      <div 
        *ngIf="isLightboxOpen" 
        (click)="closeLightbox()"
        class="fixed inset-0 z-[100] flex items-center justify-center lightbox-backdrop animate-fade-in cursor-zoom-out">
        
        <button class="absolute top-6 right-6 text-white text-3xl font-light hover:text-spiritual-saffron transition">&times;</button>
        
        <div class="max-w-4xl max-h-[85vh] p-4 relative" (click)="$event.stopPropagation()">
          <img [src]="filteredGallery[lightboxIndex].url" class="max-w-full max-h-[75vh] rounded-xl object-contain mx-auto shadow-2xl">
          
          <!-- Metadata details inside lightbox -->
          <div class="text-center text-white mt-5 space-y-2">
            <span class="px-2.5 py-0.5 text-[10px] font-semibold bg-spiritual-gold text-spiritual-dark rounded uppercase">
              {{ filteredGallery[lightboxIndex].element }} element
            </span>
            <h4 class="text-lg font-serif font-bold tracking-wide">{{ filteredGallery[lightboxIndex].templeName }}</h4>
            <p class="text-xs text-slate-300 max-w-lg mx-auto font-light leading-relaxed">
              {{ filteredGallery[lightboxIndex].description }}
            </p>
          </div>

          <!-- Navigation inside lightbox -->
          <button (click)="prevLightbox()" class="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition text-xl">⟨</button>
          <button (click)="nextLightbox()" class="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition text-xl">⟩</button>
        </div>
      </div>

    </div>
  `
})
export class GalleryComponent implements OnInit {
  isLoading = true;
  galleryItems: any[] = [];
  filteredGallery: any[] = [];
  tabs = ['All', 'Earth', 'Water', 'Fire', 'Air', 'Space'];
  activeFilter = 'All';

  isLightboxOpen = false;
  lightboxIndex = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchGallery();
  }

  fetchGallery() {
    this.isLoading = true;
    this.apiService.getGallery().subscribe({
      next: (response) => {
        if (response.success) {
          this.galleryItems = response.data;
          this.filteredGallery = response.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  filterGallery(category: string) {
    this.activeFilter = category;
    if (category === 'All') {
      this.filteredGallery = this.galleryItems;
    } else {
      this.filteredGallery = this.galleryItems.filter(
        item => item.element.toLowerCase() === category.toLowerCase()
      );
    }
  }

  openLightbox(idx: number) {
    this.lightboxIndex = idx;
    this.isLightboxOpen = true;
  }

  closeLightbox() {
    this.isLightboxOpen = false;
  }

  prevLightbox() {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.filteredGallery.length) % this.filteredGallery.length;
  }

  nextLightbox() {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.filteredGallery.length;
  }
}
