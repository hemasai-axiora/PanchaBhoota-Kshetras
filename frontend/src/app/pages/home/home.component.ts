import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface SpiritualQuote {
  text: string;
  source: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="animate-fade-in font-sans">
      
      <!-- 1. Hero Section -->
      <section class="relative h-[90vh] flex items-center justify-center text-center px-4 bg-slate-950 overflow-hidden">
        <!-- Spiritual Parallax Background Mask -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 transition-transform duration-[10s]" 
             style="background-image: url('https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1920&q=80')">
        </div>
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-spiritual-dark via-spiritual-dark/80 to-transparent"></div>
        
        <!-- Divine Glow Effect -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-spiritual-saffron/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="relative max-w-4xl mx-auto space-y-6 z-10">
          <span class="inline-block text-spiritual-gold tracking-[0.25em] font-serif text-sm font-semibold uppercase animate-pulse-subtle">
            ॐ नमः शिवाय — Om Namah Shivaya
          </span>
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-wide text-white leading-tight">
            YATRA <span class="text-spiritual-saffron">Sacred Pilgrimages</span>
          </h1>
          <p class="text-lg sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Embark on a sacred journey through the five cosmic elements, 12 holy Jyotirlingas, and Char Dham circuits.
          </p>
          <div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/temples" class="w-full sm:w-auto px-8 py-4 rounded-full saffron-gradient text-white font-semibold shadow-lg shadow-spiritual-saffron/20 hover:shadow-spiritual-saffron/40 hover:scale-105 transition duration-300 text-center">
              Explore Shrines
            </a>
            <a routerLink="/booking" class="w-full sm:w-auto px-8 py-4 rounded-full border border-white/25 text-white font-semibold hover:bg-white/10 hover:border-spiritual-gold transition duration-300 text-center">
              Book Pilgrimage
            </a>
            <a routerLink="/track" class="w-full sm:w-auto px-8 py-4 rounded-full saffron-gradient text-white font-semibold shadow-lg shadow-spiritual-saffron/20 hover:shadow-spiritual-saffron/40 hover:scale-105 transition duration-300 text-center">
              Track My Trip
            </a>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-1 opacity-70">
          <span class="text-[10px] uppercase tracking-widest text-spiritual-gold font-serif">Scroll Down</span>
          <div class="w-1.5 h-8 bg-spiritual-gold/20 rounded-full overflow-hidden">
            <div class="w-full h-1/2 bg-spiritual-gold rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      <!-- 2. Pancha Bhoota Intro -->
      <section class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold font-serif text-spiritual-saffron">The Five Cosmic Elements</h2>
          <div class="w-16 h-1 bg-spiritual-gold mx-auto rounded-full"></div>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed font-light text-base">
            In Vedic philosophy, the entire creation—including the human body—is composed of five elements: Earth, Water, Fire, Air, and Space. Lord Shiva manifests in these elements at five holy sanctums to remind us of our cosmic connection.
          </p>
        </div>

        <!-- Elements Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-6">
          <div *ngFor="let el of elementsList" class="divine-glow-card p-6 rounded-2xl text-center space-y-3">
            <div [class]="el.color + ' w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl text-white font-serif shadow-md'">
              {{ el.icon }}
            </div>
            <h3 class="text-lg font-bold font-serif">{{ el.name }}</h3>
            <p class="text-xs text-spiritual-gold uppercase tracking-wider font-semibold">{{ el.sanskrit }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">{{ el.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 3. Temples Grid -->
      <section class="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div class="space-y-3">
              <span class="text-xs text-spiritual-gold uppercase tracking-widest font-semibold font-serif">Sacred Map Path</span>
              <h2 class="text-3xl sm:text-4xl font-bold font-serif">Featured Shiva Manifestations</h2>
              <div class="w-16 h-1 bg-spiritual-gold rounded-full"></div>
            </div>
            <a routerLink="/temples" class="mt-4 md:mt-0 text-sm font-semibold text-spiritual-saffron hover:text-spiritual-gold flex items-center space-x-1 group">
              <span>View All 5 Temples</span>
              <span class="group-hover:translate-x-1 transition duration-200">→</span>
            </a>
          </div>

          <!-- Loading Skeletons -->
          <div *ngIf="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let i of [1,2,3]" class="bg-white dark:bg-slate-900/60 rounded-2xl overflow-hidden shadow border border-slate-100 dark:border-slate-800 animate-pulse">
              <div class="h-64 bg-slate-200 dark:bg-slate-800"></div>
              <div class="p-6 space-y-4">
                <div class="h-4 bg-slate-200 dark:bg-slate-800 w-1/3 rounded"></div>
                <div class="h-6 bg-slate-200 dark:bg-slate-800 w-3/4 rounded"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-800 w-5/6 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Active Temples List -->
          <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let temple of featuredTemples" class="flex flex-col bg-white dark:bg-slate-950 divine-glow-card rounded-2xl overflow-hidden">
              
              <!-- Temple Image Header -->
              <div class="relative h-64 overflow-hidden group">
                <img [src]="temple.images[0]" [alt]="temple.name" class="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <!-- Element Badge overlay -->
                <span class="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-black/60 backdrop-blur-md text-spiritual-gold border border-spiritual-gold/30">
                  {{ temple.element }} Element
                </span>
                
                <!-- Location Label -->
                <span class="absolute bottom-4 left-4 text-xs font-medium text-slate-300 flex items-center space-x-1">
                  <svg class="w-3.5 h-3.5 text-spiritual-saffron" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                  <span>{{ temple.location }}, {{ temple.state }}</span>
                </span>
              </div>

              <!-- Temple Details -->
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <h3 class="text-xl font-bold font-serif text-slate-800 dark:text-slate-100 group-hover:text-spiritual-saffron transition duration-200">
                    {{ temple.name }}
                  </h3>
                  <p class="text-xs text-spiritual-saffron uppercase font-semibold tracking-wider">
                    Manifestation: {{ temple.elementSanskrit }}
                  </p>
                  <p class="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed line-clamp-3">
                    {{ temple.description }}
                  </p>
                </div>

                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-xs font-medium text-slate-400">Timings: {{ temple.timings.morning.split(' ')[0] }}...</span>
                  <a [routerLink]="['/temples', temple._id]" class="px-4 py-2 text-xs font-semibold rounded-full border border-spiritual-saffron text-spiritual-saffron hover:bg-spiritual-saffron hover:text-white transition duration-300">
                    View Details
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <!-- 4. Statistics Banner Strip -->
      <section class="py-12 saffron-gradient text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div class="space-y-1">
              <p class="text-4xl sm:text-5xl font-serif font-bold">5</p>
              <p class="text-xs sm:text-sm uppercase tracking-widest text-orange-100 font-medium">Cosmic Elements</p>
            </div>
            <div class="space-y-1">
              <p class="text-4xl sm:text-5xl font-serif font-bold">1</p>
              <p class="text-xs sm:text-sm uppercase tracking-widest text-orange-100 font-medium">Sacred Source (Shiva)</p>
            </div>
            <div class="space-y-1">
              <p class="text-4xl sm:text-5xl font-serif font-bold">3500+</p>
              <p class="text-xs sm:text-sm uppercase tracking-widest text-orange-100 font-medium">Years History</p>
            </div>
            <div class="space-y-1">
              <p class="text-4xl sm:text-5xl font-serif font-bold">Millions</p>
              <p class="text-xs sm:text-sm uppercase tracking-widest text-orange-100 font-medium">Seekers Blessed</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Devotional Quote Generator -->
      <section class="py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <span class="text-4xl text-spiritual-gold opacity-60">“</span>
        <div class="space-y-4 min-h-[140px] flex flex-col justify-center">
          <p class="text-xl sm:text-2xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed max-w-2xl mx-auto animate-fade-in">
            {{ currentQuote.text }}
          </p>
          <p class="text-xs font-semibold uppercase tracking-widest text-spiritual-saffron font-serif">
            — {{ currentQuote.source }}
          </p>
        </div>
        <button (click)="getRandomQuote()" class="px-6 py-2.5 rounded-full border border-spiritual-gold/30 hover:border-spiritual-saffron text-xs font-semibold text-spiritual-gold hover:text-spiritual-saffron transition duration-300">
          Seek Another Grace
        </button>
      </section>

      <!-- 6. Featured Gallery Collage Grid -->
      <section class="py-20 bg-slate-50 dark:bg-slate-900/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div class="text-center space-y-3">
            <h2 class="text-3xl font-serif">Sacred Glimpses</h2>
            <div class="w-12 h-0.5 bg-spiritual-gold mx-auto"></div>
            <p class="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">Visual representations of the divine element sanctums</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let g of featuredGallery" class="group relative h-72 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 cursor-pointer">
              <img [src]="g.url" [alt]="g.temple" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition duration-300"></div>
              
              <div class="absolute bottom-4 left-4 right-4 text-left space-y-1">
                <span class="px-2 py-0.5 text-[9px] font-semibold bg-spiritual-saffron rounded text-white uppercase">{{ g.element }}</span>
                <p class="text-sm font-semibold font-serif text-white line-clamp-1">{{ g.temple }}</p>
              </div>
            </div>
          </div>

          <div class="text-center pt-4">
            <a routerLink="/gallery" class="px-8 py-3.5 rounded-full border border-spiritual-saffron text-spiritual-saffron font-semibold hover:bg-spiritual-saffron hover:text-white transition duration-300 text-sm">
              Explore Full Gallery
            </a>
          </div>

        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  isLoading = true;
  featuredTemples: any[] = [];
  
  elementsList = [
    { name: 'Earth', sanskrit: 'Prithvi', icon: '🪨', color: 'bg-amber-700', desc: 'Representing solid physical manifestation and structural base.' },
    { name: 'Water', sanskrit: 'Appu / Jala', icon: '💧', color: 'bg-blue-600', desc: 'Representing sensory flow, creative energy, and dynamic balance.' },
    { name: 'Fire', sanskrit: 'Tejas / Agni', icon: '🔥', color: 'bg-orange-600', desc: 'Representing dynamic transformation, energy, and illuminated wisdom.' },
    { name: 'Air', sanskrit: 'Vayu', icon: '💨', color: 'bg-teal-500', desc: 'Representing breathe of life, mental movement, and cosmic currents.' },
    { name: 'Space', sanskrit: 'Akasha', icon: '🌌', color: 'bg-indigo-700', desc: 'Representing infinite space, ultimate liberation, and inner consciousness.' }
  ];

  quotesList: SpiritualQuote[] = [
    { text: "He is the Earth, the Water, the Fire, the Air, and the Ether. He is the cosmic source of all living beings, the eternal Lord Shiva.", source: "Shiva Purana" },
    { text: "There, where there is nothingness, there is Lord Shiva, dancing in the space of consciousness, in the temple of Chidambaram.", source: "Suta Samhita" },
    { text: "By worshiping the Agni Lingam of Arunachala, the fire of divine knowledge is lit, burning away all bindings of past karma.", source: "Skanda Purana" },
    { text: "Like the unseen breeze that makes the temple flame dance in Kalahasti, the supreme spirit acts invisibly within our breaths.", source: "Rigveda Upanishad" },
    { text: "The whole world is a manifestation of the five cosmic elements, and in worshiping them, we worship the supreme Lord of the single mango tree.", source: "Nayanmar Hymns" }
  ];

  currentQuote!: SpiritualQuote;

  featuredGallery = [
    { url: '/images/ekambareswarar.png', temple: 'Ekambareswarar Temple', element: 'Earth' },
    { url: '/images/jambukeswarar.png', temple: 'Jambukeswarar Temple', element: 'Water' },
    { url: '/images/arunachaleswarar.png', temple: 'Arunachaleswarar Temple', element: 'Fire' },
    { url: '/images/kalahasti.png', temple: 'Sri Kalahasti Temple', element: 'Air' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getRandomQuote();
    this.fetchTemples();
  }

  fetchTemples() {
    this.apiService.getTemples().subscribe({
      next: (response) => {
        if (response.success) {
          // Display first 3 temples on home page, or all 5
          this.featuredTemples = response.data.slice(0, 3);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getRandomQuote() {
    const idx = Math.floor(Math.random() * this.quotesList.length);
    this.currentQuote = this.quotesList[idx];
  }
}
