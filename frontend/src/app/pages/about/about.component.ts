import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface ChakraItem {
  chakra: string;
  element: string;
  sanskrit: string;
  templeName: string;
  color: string;
  glowColor: string;
  description: string;
  templeId?: string;
  spiritualAspects: string[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in font-sans">
      
      <!-- 1. Hero Block -->
      <div class="text-center space-y-4 mb-20">
        <span class="text-xs uppercase font-serif tracking-[0.2em] text-spiritual-gold font-bold">Vedic Cosmology</span>
        <h1 class="text-4xl sm:text-5xl font-serif font-bold text-spiritual-saffron">The Cosmic Dance of Elements</h1>
        <div class="w-16 h-1 bg-spiritual-gold mx-auto rounded-full"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Understanding the philosophical and spiritual framework behind the Pancha Bhoota Kshetras—where the divine meets the building blocks of creation.
        </p>
      </div>

      <!-- 2. Dual Panel Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div class="space-y-6">
          <h2 class="text-3xl font-serif text-slate-800 dark:text-slate-100">What are <span class="text-spiritual-saffron">Pancha Bhootas</span>?</h2>
          <div class="w-12 h-0.5 bg-spiritual-gold"></div>
          
          <div class="text-sm text-slate-600 dark:text-slate-300 space-y-4 font-light leading-relaxed">
            <p>
              In ancient Vedic philosophy, the physical universe is synthesized from five primal elements (Pancha Bhootas): **Earth (Prithvi), Water (Apas), Fire (Tejas), Air (Vayu), and Space (Akasha)**. These elements are not just physical states but cosmic principles representing density, flow, transformation, movement, and infinite space.
            </p>
            <p>
              **Kshetra** translates directly to a holy field or pilgrimage site. The **Pancha Bhoota Kshetras** are five ancient South Indian temples dedicated to Lord Shiva where he manifested himself in the forms of these five distinct elemental forces to establish order and show humanity that the divine is present in all physical structures.
            </p>
            <p>
              By visiting these energy fields, seekers learn to balance the elements within themselves, leading to physical wellness, mental calmness, and ultimately, spiritual awakening.
            </p>
          </div>
        </div>

        <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 h-96">
          <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80" alt="Cosmic Shiva Art" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <p class="text-xs tracking-wider text-spiritual-gold uppercase font-semibold">Upanishadic Verse</p>
            <p class="text-sm italic font-serif leading-relaxed">
              "From Him arose Space; from Space arose Air; from Air arose Fire; from Fire arose Water; from Water arose Earth."
            </p>
            <p class="text-[10px] text-slate-400 font-semibold">— Taittiriya Upanishad (2.1)</p>
          </div>
        </div>
      </div>

      <!-- 3. Yogic Chakra Mapping Section -->
      <div class="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-8 sm:p-12 mb-20 border border-slate-100 dark:border-slate-800/80">
        
        <div class="text-center space-y-3 mb-12">
          <h2 class="text-2xl sm:text-3xl font-serif text-spiritual-saffron">Yogic Balance: Elements & Chakras</h2>
          <div class="w-10 h-0.5 bg-spiritual-gold mx-auto"></div>
          <p class="text-xs text-slate-400 uppercase tracking-widest font-medium">How the 5 temple shrines correlate directly with human energetic biology</p>
        </div>

        <!-- Interactive Diagram Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left: SVG Meditating Figure -->
          <div class="lg:col-span-5 flex flex-col items-center space-y-6">
            <div class="relative bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg w-full flex justify-center items-center">
              
              <svg viewBox="0 0 300 400" class="w-full max-w-[280px] sm:max-w-[340px] h-auto drop-shadow-2xl text-slate-300 dark:text-slate-800">
                <!-- Meditating Silhouette -->
                <!-- Head -->
                <path d="M150,40 C165,40 175,52 175,68 C175,84 165,96 150,96 C135,96 125,84 125,68 C125,52 135,40 150,40 Z" fill="none" stroke="currentColor" stroke-width="2" />
                <!-- Torso & Arms -->
                <path d="M138,94 L138,105 C138,108 120,115 105,122 C80,132 60,145 60,165 L60,210 C60,225 70,235 85,240 L115,242 C125,242 128,250 122,260 C110,280 85,310 50,330 C45,333 45,340 50,342 L250,342 C255,340 255,333 250,330 C215,310 190,280 178,260 C172,250 175,242 185,242 L215,242 C230,235 240,225 240,210 L240,165 C240,145 220,132 195,122 C180,115 162,108 162,105 L162,94" fill="none" stroke="currentColor" stroke-width="2" />
                <!-- Spine Line -->
                <line x1="150" y1="96" x2="150" y2="340" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" />

                <!-- Chakra points -->
                <g *ngFor="let item of chakraMapping; let idx = index" 
                   (mouseenter)="selectChakra(idx)"
                   (click)="selectChakra(idx)"
                   class="cursor-pointer group">
                  <!-- Outer glow aura (pulsing if active) -->
                  <circle [attr.cx]="150" [attr.cy]="getChakraY(idx)" [attr.r]="selectedChakraIdx === idx ? 22 : 14"
                          [attr.fill]="item.glowColor"
                          [class]="selectedChakraIdx === idx ? 'opacity-40 animate-pulse' : 'opacity-0 group-hover:opacity-20'"
                          class="transition-all duration-300" />
                  
                  <!-- Main Chakra Node -->
                  <circle [attr.cx]="150" [attr.cy]="getChakraY(idx)" [attr.r]="selectedChakraIdx === idx ? 9 : 7"
                          [attr.fill]="selectedChakraIdx === idx ? getChakraHex(item.element) : 'currentColor'"
                          [class]="selectedChakraIdx === idx ? 'stroke-white dark:stroke-slate-950 stroke-2' : 'text-slate-400 dark:text-slate-600 hover:text-slate-300'"
                          class="transition-all duration-300" />

                  <!-- Text label beside point -->
                  <text [attr.x]="170" [attr.y]="getChakraY(idx) + 4" 
                        [class]="selectedChakraIdx === idx ? 'font-bold fill-slate-800 dark:fill-white text-[11px]' : 'fill-slate-400 dark:fill-slate-500 text-[10px]'"
                        class="font-sans pointer-events-none select-none transition-all duration-300">
                    {{ item.chakra.split(' ')[0] }}
                  </text>
                </g>
              </svg>

            </div>
            <p class="text-xs text-slate-400 text-center italic">Hover or click on the chakra nodes to explore their spiritual properties</p>
          </div>

          <!-- Right: Dynamic Details Display Card -->
          <div class="lg:col-span-7 space-y-6">
            <div class="divine-glow-card p-8 rounded-3xl shadow-xl transition-all duration-500 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-2" [ngClass]="getActiveChakra().color"></div>
              
              <!-- Chakra Element Info Header -->
              <div class="flex items-start justify-between flex-wrap gap-4">
                <div class="space-y-1">
                  <span class="text-xs font-bold text-spiritual-gold tracking-widest uppercase">{{ getActiveChakra().chakra }}</span>
                  <h3 class="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {{ getActiveChakra().element }} Element
                    <span class="text-sm font-sans font-normal text-slate-400">(Sanskrit: {{ getActiveChakra().sanskrit }})</span>
                  </h3>
                </div>
                <span class="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-md" [ngClass]="getActiveChakra().color">
                  {{ getActiveChakra().element }}
                </span>
              </div>

              <!-- Temple Details -->
              <div class="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 space-y-3">
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Manifestation Temple Shrines</span>
                <h4 class="text-lg font-serif font-bold text-spiritual-saffron">
                  {{ getActiveChakra().templeName }}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {{ getActiveChakra().description }}
                </p>

                <!-- Dynamic Temple Details Button link -->
                <div class="pt-2 flex justify-start">
                  <a *ngIf="getActiveChakra().templeId; else searchTemplesLink" 
                     [routerLink]="['/temples', getActiveChakra().templeId]"
                     class="px-5 py-2 rounded-full border border-spiritual-saffron text-spiritual-saffron hover:bg-spiritual-saffron hover:text-white text-xs font-semibold transition duration-300">
                    Explore Temple Details & Map →
                  </a>
                  <ng-template #searchTemplesLink>
                    <a routerLink="/temples"
                       class="px-5 py-2 rounded-full border border-spiritual-saffron text-spiritual-saffron hover:bg-spiritual-saffron hover:text-white text-xs font-semibold transition duration-300">
                      Explore Shrines Directory →
                    </a>
                  </ng-template>
                </div>
              </div>

              <!-- Spiritual and Balancing benefits -->
              <div class="mt-6 space-y-4">
                <h5 class="text-xs uppercase font-bold tracking-wider text-slate-400">Energetic & Biological Alignment</h5>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <li *ngFor="let aspect of getActiveChakra().spiritualAspects" class="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <span class="w-4 h-4 rounded-full saffron-gradient flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold">✓</span>
                    <span class="font-light leading-normal">{{ aspect }}</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

      </div>

      <!-- 4. Sacred Nayanmar Stanza block -->
      <section class="max-w-3xl mx-auto text-center space-y-6 pt-8">
        <span class="text-4xl text-spiritual-gold font-serif">ॐ</span>
        <blockquote class="text-lg italic font-serif leading-relaxed text-slate-700 dark:text-slate-300">
          "The Lord who dances in the golden hall of Chidambaram, who shines as a fire-pillar in Annamalai, who manifests as sand in Kanchi, water in Thiruvanaikoil, and breeze in Kalahasti, protects all who surrender to Him."
        </blockquote>
        <p class="text-xs uppercase tracking-widest font-bold text-spiritual-saffron font-serif">— Appar Tirumurai Stanza</p>
      </section>

    </div>
  `,
  styles: []
})
export class AboutComponent implements OnInit {
  selectedChakraIdx = 4; // Default to Space element (Throat Chakra)

  chakraMapping: ChakraItem[] = [
    {
      chakra: 'Muladhara (Root Chakra)',
      element: 'Earth',
      sanskrit: 'Prithvi',
      templeName: 'Ekambareswarar Temple (Kanchipuram)',
      color: 'bg-amber-800',
      glowColor: 'rgba(146, 64, 14, 0.4)',
      description: 'Coordinates physical grounding, stability, safety, bone density, and releases deep-seated anxieties.',
      spiritualAspects: [
        'Root grounding and physical stability.',
        'Dispels fears and installs mental courage.',
        'Aids in material wellness and focus.',
        'Balances structural health of the physical body.'
      ]
    },
    {
      chakra: 'Swadhishthana (Sacral Chakra)',
      element: 'Water',
      sanskrit: 'Apas',
      templeName: 'Jambukeswarar Temple (Thiruvanaikaval)',
      color: 'bg-blue-600',
      glowColor: 'rgba(37, 99, 235, 0.4)',
      description: 'Coordinates sensory experiences, fluid emotional balance, flow, creation, and relationships.',
      spiritualAspects: [
        'Fluid creative expression and balance.',
        'Soothes hot tempers and toxic moods.',
        'Promotes sensory clarity and joy.',
        'Enhances adaptability and flow of life energy.'
      ]
    },
    {
      chakra: 'Manipura (Solar Plexus Chakra)',
      element: 'Fire',
      sanskrit: 'Tejas',
      templeName: 'Arunachaleswarar Temple (Tiruvannamalai)',
      color: 'bg-orange-600',
      glowColor: 'rgba(234, 88, 12, 0.4)',
      description: 'Coordinates personal willpower, vital life force (Prana), digestion, courage, and transformation.',
      spiritualAspects: [
        'Ignites personal drive and will power.',
        'Destroys ego and inner laziness.',
        'Promotes high energy and metabolism.',
        'Fuels the fire of divine self-knowledge.'
      ]
    },
    {
      chakra: 'Anahata (Heart Chakra)',
      element: 'Air',
      sanskrit: 'Vayu',
      templeName: 'Sri Kalahasti Temple (Srikalahasti)',
      color: 'bg-teal-500',
      glowColor: 'rgba(13, 148, 136, 0.4)',
      description: 'Coordinates breath expansion, heart energy, compassion, and nervous control.',
      spiritualAspects: [
        'Expands heart capacity for universal love.',
        'Relieves respiratory blockages and asthma.',
        'Improves empathy and mental calmness.',
        'Balances vital cosmic currents in the body.'
      ]
    },
    {
      chakra: 'Vishuddha (Throat Chakra)',
      element: 'Space',
      sanskrit: 'Akasha',
      templeName: 'Chidambaram Nataraja Temple (Chidambaram)',
      color: 'bg-indigo-700',
      glowColor: 'rgba(67, 56, 202, 0.4)',
      description: 'Coordinates cosmic sound vibrations, self-expression, expanded consciousness, and truth.',
      spiritualAspects: [
        'Unlocks high clear speech and truth.',
        'Connects the seeker to cosmic consciousness.',
        'Enhances capabilities in fine arts and music.',
        'Aligns the inner space with ultimate formless reality.'
      ]
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchTemples();
  }

  fetchTemples() {
    this.apiService.getTemples().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Map backend IDs to respective elements based on name match
          res.data.forEach((temple: any) => {
            const index = this.chakraMapping.findIndex(
              c => temple.element.toLowerCase() === c.element.toLowerCase()
            );
            if (index !== -1) {
              this.chakraMapping[index].templeId = temple._id;
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to link temple details statically', err);
      }
    });
  }

  selectChakra(idx: number) {
    this.selectedChakraIdx = idx;
  }

  getActiveChakra(): ChakraItem {
    return this.chakraMapping[this.selectedChakraIdx];
  }

  getChakraY(idx: number): number {
    // Return vertical Y coordinates corresponding to chakra spine points
    // Throat: 110, Heart: 160, Solar Plexus: 210, Sacral: 260, Root: 310
    const coordinates = [310, 260, 210, 160, 110]; // Ordered from Muladhara to Vishuddha
    return coordinates[idx];
  }

  getChakraHex(element: string): string {
    switch (element) {
      case 'Earth': return '#92400e';
      case 'Water': return '#2563eb';
      case 'Fire': return '#ea580c';
      case 'Air': return '#0d9488';
      case 'Space': return '#4338ca';
      default: return '#fbbf24';
    }
  }
}

