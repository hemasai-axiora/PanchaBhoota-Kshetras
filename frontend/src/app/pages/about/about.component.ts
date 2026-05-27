import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
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
        
        <div class="text-center space-y-3 mb-16">
          <h2 class="text-2xl sm:text-3xl font-serif text-spiritual-saffron">Yogic Balance: Elements & Chakras</h2>
          <div class="w-10 h-0.5 bg-spiritual-gold mx-auto"></div>
          <p class="text-xs text-slate-400 uppercase tracking-widest font-medium">How the 5 temple shrines correlate directly with human energetic biology</p>
        </div>

        <!-- Chakra Element Timeline -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div *ngFor="let item of chakraMapping" class="flex flex-col bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm relative group overflow-hidden">
            
            <div class="absolute top-0 left-0 w-full h-1" [ngClass]="item.color"></div>
            
            <div class="space-y-4">
              <!-- Chakra info -->
              <span class="text-[10px] uppercase font-bold text-spiritual-gold">{{ item.chakra }}</span>
              
              <div class="space-y-1">
                <h3 class="text-lg font-serif font-bold">{{ item.element }} Element</h3>
                <p class="text-xs text-slate-400">Sanskrit: {{ item.sanskrit }}</p>
              </div>

              <!-- Temple Mapping -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <p class="font-bold text-spiritual-saffron">{{ item.temple }}</p>
                <p class="text-[11px] text-slate-400 mt-0.5 font-light leading-relaxed">{{ item.description }}</p>
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
  `
})
export class AboutComponent {
  chakraMapping = [
    {
      chakra: 'Muladhara (Root)',
      element: 'Earth',
      sanskrit: 'Prithvi',
      temple: 'Ekambareswarar',
      color: 'bg-amber-800',
      description: 'Coordinates physical grounding, bone density, stability, and releases anxieties.'
    },
    {
      chakra: 'Swadhishthana (Sacral)',
      element: 'Water',
      sanskrit: 'Apas',
      temple: 'Jambukeswarar',
      color: 'bg-blue-600',
      description: 'Coordinates sensory experiences, emotional wellness, creations, and relationships.'
    },
    {
      chakra: 'Manipura (Solar Plexus)',
      element: 'Fire',
      sanskrit: 'Tejas',
      temple: 'Arunachaleswarar',
      color: 'bg-orange-600',
      description: 'Coordinates willpower, vital force, digestion, courage, and actions.'
    },
    {
      chakra: 'Anahata (Heart)',
      element: 'Air',
      sanskrit: 'Vayu',
      temple: 'Sri Kalahasti',
      color: 'bg-teal-500',
      description: 'Coordinates breath expansion, heart energy, compassion, and nervous control.'
    },
    {
      chakra: 'Vishuddha (Throat)',
      element: 'Space',
      sanskrit: 'Akasha',
      temple: 'Chidambaram Nataraja',
      color: 'bg-indigo-700',
      description: 'Coordinates cosmic sound vibrations, self-expression, expanded consciousness, and truth.'
    }
  ];
}
