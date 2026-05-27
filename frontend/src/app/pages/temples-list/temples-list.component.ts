import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-temples-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in font-sans">
      
      <!-- Page Header -->
      <div class="text-center space-y-4 mb-16">
        <span class="text-xs uppercase font-serif tracking-[0.2em] text-spiritual-gold font-bold">Five Elements Sanctums</span>
        <h1 class="text-4xl sm:text-5xl font-serif font-bold text-spiritual-saffron">The Sacred Temples Directory</h1>
        <div class="w-16 h-1 bg-spiritual-gold mx-auto rounded-full"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Embark on a virtual pilgrimage through the holy sites. Filter by cosmic elements or search specific details of Lord Shiva's local forms.
        </p>
      </div>

      <!-- Controls: Search & Element Filters -->
      <div class="mb-12 space-y-6">
        
        <!-- Search bar -->
        <div class="max-w-2xl mx-auto relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onSearchChange()" 
            placeholder="Search by temple name, deity, Sanskrit term, or city..."
            class="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-spiritual-gold focus:border-transparent shadow-sm text-sm font-medium transition duration-300">
        </div>

        <!-- Filter Tags -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button 
            *ngFor="let tab of tabsList" 
            (click)="selectTab(tab)"
            [ngClass]="activeTab === tab ? 'saffron-gradient text-white shadow-md shadow-spiritual-saffron/10' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-spiritual-gold text-slate-700 dark:text-slate-300'"
            class="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300">
            {{ tab }}
          </button>
        </div>

      </div>

      <!-- Loading skeleton block -->
      <div *ngIf="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let s of [1,2,3,4,5]" class="bg-white dark:bg-slate-900/60 rounded-2xl overflow-hidden shadow border border-slate-100 dark:border-slate-800 animate-pulse">
          <div class="h-64 bg-slate-200 dark:bg-slate-800"></div>
          <div class="p-6 space-y-4">
            <div class="h-4 bg-slate-200 dark:bg-slate-800 w-1/3 rounded"></div>
            <div class="h-6 bg-slate-200 dark:bg-slate-800 w-3/4 rounded"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 w-5/6 rounded"></div>
          </div>
        </div>
      </div>

      <!-- No items found screen -->
      <div *ngIf="!isLoading && temples.length === 0" class="text-center py-20 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
        <span class="text-4xl">🕉️</span>
        <h3 class="text-xl font-bold font-serif">No Temples Found</h3>
        <p class="text-sm text-slate-500 max-w-sm mx-auto">
          We couldn't find any holy temples matching your active search filters. Try clearing keywords or elements.
        </p>
        <button (click)="resetFilters()" class="px-5 py-2.5 rounded-full border border-spiritual-saffron text-spiritual-saffron text-xs font-semibold hover:bg-spiritual-saffron hover:text-white transition duration-300">
          Reset Filters
        </button>
      </div>

      <!-- Active Grid Directory -->
      <div *ngIf="!isLoading && temples.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          *ngFor="let temple of temples" 
          class="flex flex-col bg-white dark:bg-slate-950 divine-glow-card rounded-2xl overflow-hidden group">
          
          <!-- Image Container -->
          <div class="relative h-64 overflow-hidden">
            <img [src]="temple.images[0]" [alt]="temple.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <!-- Element tag -->
            <span [ngClass]="getElementColor(temple.element)" class="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full border text-white shadow-md">
              {{ temple.element }} Element
            </span>

            <!-- Location city -->
            <span class="absolute bottom-4 left-4 text-xs font-medium text-slate-300 flex items-center space-x-1">
              <svg class="w-3.5 h-3.5 text-spiritual-saffron" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span>{{ temple.location }}, {{ temple.state }}</span>
            </span>
          </div>

          <!-- Description and details -->
          <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
            
            <div class="space-y-2.5">
              <h3 class="text-xl font-bold font-serif text-slate-800 dark:text-slate-100 group-hover:text-spiritual-saffron transition duration-200">
                {{ temple.name }}
              </h3>
              <div class="flex items-center space-x-2 text-xs font-semibold text-spiritual-gold uppercase font-serif">
                <span>{{ temple.elementSanskrit }}</span>
                <span>•</span>
                <span>{{ temple.deity.split(' ')[0] }}...</span>
              </div>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed line-clamp-3">
                {{ temple.description }}
              </p>
            </div>

            <!-- Timings and button -->
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div class="text-[11px] text-slate-400">
                <p>Morning: {{ temple.timings.morning.split(' ')[0] }}</p>
              </div>
              <a [routerLink]="['/temples', temple._id]" class="px-4 py-2 text-xs font-bold rounded-full border border-spiritual-saffron text-spiritual-saffron hover:bg-spiritual-saffron hover:text-white transition duration-300">
                View Details
              </a>
            </div>

          </div>

        </div>
      </div>

    </div>
  `
})
export class TemplesListComponent implements OnInit {
  isLoading = true;
  temples: any[] = [];
  searchQuery = '';
  activeTab = 'All';
  tabsList = ['All', 'Earth', 'Water', 'Fire', 'Air', 'Space'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchTemples();
  }

  fetchTemples() {
    this.isLoading = true;
    this.apiService.getTemples(this.searchQuery, this.activeTab).subscribe({
      next: (response) => {
        if (response.success) {
          this.temples = response.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.fetchTemples();
  }

  onSearchChange() {
    this.fetchTemples();
  }

  resetFilters() {
    this.searchQuery = '';
    this.activeTab = 'All';
    this.fetchTemples();
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
}
