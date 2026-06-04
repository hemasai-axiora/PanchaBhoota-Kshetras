import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-[#0A0A16] border-t border-spiritual-gold/10 text-slate-300 font-sans pt-16 pb-8 mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Grid Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <!-- Column 1: Intro -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold tracking-wider text-spiritual-saffron font-serif">YATRA</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Explore the cosmic representations of Lord Shiva across sacred temples, Jyotirlingas, and Char Dham circuits.
            </p>
            <div class="flex space-x-3 pt-2">
              <!-- Divine lotus shape or simple circles -->
              <span class="w-8 h-8 rounded-full border border-spiritual-gold/20 flex items-center justify-center text-spiritual-gold text-xs hover:border-spiritual-saffron hover:text-spiritual-saffron transition duration-300">ॐ</span>
              <span class="w-8 h-8 rounded-full border border-spiritual-gold/20 flex items-center justify-center text-spiritual-gold text-xs hover:border-spiritual-saffron hover:text-spiritual-saffron transition duration-300">शिव</span>
              <span class="w-8 h-8 rounded-full border border-spiritual-gold/20 flex items-center justify-center text-spiritual-gold text-xs hover:border-spiritual-saffron hover:text-spiritual-saffron transition duration-300">नमः</span>
            </div>
          </div>

          <!-- Column 2: Temples Quick Jump -->
          <div>
            <h4 class="text-lg font-semibold font-serif text-spiritual-gold mb-6">The 5 Elements</h4>
            <ul class="space-y-3 text-sm">
              <li>
                <a routerLink="/temples" class="hover:text-spiritual-saffron transition duration-300 flex items-center space-x-2">
                  <span class="text-spiritual-saffron">●</span>
                  <span>Earth — Ekambareswarar</span>
                </a>
              </li>
              <li>
                <a routerLink="/temples" class="hover:text-spiritual-saffron transition duration-300 flex items-center space-x-2">
                  <span class="text-blue-400">●</span>
                  <span>Water — Jambukeswarar</span>
                </a>
              </li>
              <li>
                <a routerLink="/temples" class="hover:text-spiritual-saffron transition duration-300 flex items-center space-x-2">
                  <span class="text-red-500">●</span>
                  <span>Fire — Arunachaleswarar</span>
                </a>
              </li>
              <li>
                <a routerLink="/temples" class="hover:text-spiritual-saffron transition duration-300 flex items-center space-x-2">
                  <span class="text-teal-400">●</span>
                  <span>Air — Sri Kalahasti</span>
                </a>
              </li>
              <li>
                <a routerLink="/temples" class="hover:text-spiritual-saffron transition duration-300 flex items-center space-x-2">
                  <span class="text-indigo-400">●</span>
                  <span>Space — Chidambaram</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Quick Navigation -->
          <div>
            <h4 class="text-lg font-semibold font-serif text-spiritual-gold mb-6">Site Links</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/" class="hover:text-spiritual-saffron transition duration-300">Home</a></li>
              <li><a routerLink="/temples" class="hover:text-spiritual-saffron transition duration-300">Temples Directory</a></li>
              <li><a routerLink="/gallery" class="hover:text-spiritual-saffron transition duration-300">Sacred Gallery</a></li>
              <li><a routerLink="/about" class="hover:text-spiritual-saffron transition duration-300">About cosmic dance</a></li>
              <li><a routerLink="/contact" class="hover:text-spiritual-saffron transition duration-300">Contact / Inquiries</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact Info -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold font-serif text-spiritual-gold mb-4">Spiritual Center</h4>
            <p class="text-sm text-slate-400 leading-relaxed">
              Dedicated to sharing the rich Vedic knowledge and legendary histories of our temples.
            </p>
            <div class="text-xs text-slate-500 space-y-1">
              <p>Email: contact&#64;yatra.org</p>
              <p>Address: Sacred Southern India Pilgrimage Route</p>
              <p>Workings: 6:00 AM – 9:00 PM</p>
            </div>
          </div>

        </div>

        <div class="border-t border-slate-800/80 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Yatra Sacred Pilgrimages. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a routerLink="/about" class="hover:text-spiritual-gold">Privacy Policy</a>
            <a routerLink="/about" class="hover:text-spiritual-gold">Terms of Use</a>
            <a routerLink="/contact" class="hover:text-spiritual-gold">Support Forum</a>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {}
