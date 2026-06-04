import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

interface YatraPackage {
  id: string;
  category: 'panchabhoota' | 'jyotirlinga' | 'chardham' | 'individual';
  name: string;
  price: string;
  subtitle: string;
  badge: string;
  description: string;
  accommodation: string;
  transport: string;
  meals: string;
  poojaAccess: string;
  inclusions: string[];
  gradientClass: string;
  btnClass: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in font-sans">
      
      <!-- Page Header -->
      <div class="text-center space-y-3 mb-12">
        <span class="text-xs uppercase font-serif tracking-[0.2em] text-spiritual-gold font-bold">Pilgrimage Travel</span>
        <h1 class="text-4xl font-serif font-bold text-spiritual-saffron">Tour Packages</h1>
        <div class="w-12 h-1 bg-spiritual-gold mx-auto rounded-full"></div>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Select from our curated cosmic yatra packages or customize an individual temple tour.
        </p>
      </div>

      <!-- Package Category Tabs -->
      <div class="flex flex-wrap justify-center border-b border-slate-200 dark:border-slate-800 mb-10 gap-2 sm:gap-6">
        <button 
          (click)="activeCategory = 'panchabhoota'"
          [ngClass]="activeCategory === 'panchabhoota' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition duration-200">
          🌀 Pancha Bhoota Kshetras
        </button>
        <button 
          (click)="activeCategory = 'jyotirlinga'"
          [ngClass]="activeCategory === 'jyotirlinga' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition duration-200">
          🔱 12 Jyotirlinga Yatras
        </button>
        <button 
          (click)="activeCategory = 'chardham'"
          [ngClass]="activeCategory === 'chardham' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition duration-200">
          🏔️ Char Dham Circuits
        </button>
        <button 
          (click)="activeCategory = 'individual'"
          [ngClass]="activeCategory === 'individual' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition duration-200">
          🛕 Individual Custom Tours
        </button>
      </div>

      <!-- Tour Packages Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div *ngFor="let pkg of filteredPackages" 
             class="flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md relative overflow-hidden transition duration-300 hover:shadow-xl">
          
          <div class="absolute top-0 left-0 w-full h-1.5" [ngClass]="pkg.gradientClass"></div>
          
          <!-- Package Header -->
          <div class="p-6 border-b border-slate-100 dark:border-slate-800">
            <span class="px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase text-white tracking-wider" [ngClass]="pkg.gradientClass">
              {{ pkg.badge }}
            </span>
            <h3 class="text-lg font-serif font-bold text-slate-800 dark:text-slate-100 mt-3">{{ pkg.name }}</h3>
            <p class="text-[11px] text-slate-400 font-light mt-0.5">{{ pkg.subtitle }}</p>
            <div class="mt-3 flex items-baseline">
              <span class="text-2xl font-serif font-bold text-spiritual-saffron">{{ pkg.price }}</span>
              <span class="text-xs text-slate-400 font-light ml-1">/ person</span>
            </div>
          </div>

          <!-- Package Details -->
          <div class="p-6 flex-grow space-y-4">
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{{ pkg.description }}</p>
            
            <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex items-center space-x-2">
                <span>🏨</span>
                <span><strong>Stay:</strong> {{ pkg.accommodation }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span>🚗</span>
                <span><strong>Travel:</strong> {{ pkg.transport }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span>🍲</span>
                <span><strong>Meals:</strong> {{ pkg.meals }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span>🛕</span>
                <span><strong>Pooja:</strong> {{ pkg.poojaAccess }}</span>
              </div>
            </div>

            <!-- Inclusions -->
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
              <ul class="space-y-1.5">
                <li *ngFor="let inc of pkg.inclusions" class="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span class="text-emerald-500 font-bold">✓</span>
                  <span>{{ inc }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Select Package Button -->
          <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/5">
            <button (click)="selectPackage(pkg.id)" 
                    class="w-full py-2.5 rounded-full text-xs font-bold transition duration-200 hover:opacity-90 shadow"
                    [ngClass]="pkg.btnClass">
              Select Package
            </button>
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <div id="booking-form" class="max-w-2xl mx-auto bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg">
        <h2 class="text-xl font-serif font-bold text-spiritual-saffron mb-4">Book Your Tour</h2>
        
        <form #yatraForm="ngForm" (ngSubmit)="onSubmit(yatraForm)" class="space-y-4 text-xs font-medium">
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Full Name -->
            <div class="space-y-1">
              <label for="name" class="text-slate-400">Full Name</label>
              <input type="text" id="name" name="name" required [(ngModel)]="formData.name" #nameField="ngModel"
                     [ngClass]="{'border-rose-400': nameField.invalid && nameField.touched}"
                     class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs"
                     placeholder="Your name">
            </div>

            <!-- Email Address -->
            <div class="space-y-1">
              <label for="email" class="text-slate-400">Email Address</label>
              <input type="email" id="email" name="email" required email [(ngModel)]="formData.email" #emailField="ngModel"
                     [ngClass]="{'border-rose-400': emailField.invalid && emailField.touched}"
                     class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs"
                     placeholder="Your email">
            </div>

            <!-- Phone Number -->
            <div class="space-y-1">
              <label for="phone" class="text-slate-400">Contact Number</label>
              <input type="tel" id="phone" name="phone" required [(ngModel)]="formData.phone" #phoneField="ngModel"
                     [ngClass]="{'border-rose-400': phoneField.invalid && phoneField.touched}"
                     class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs"
                     placeholder="Phone number">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Package Selection -->
            <div class="space-y-1">
              <label for="package" class="text-slate-400">Package</label>
              <select id="package" name="package" required [(ngModel)]="formData.package"
                      class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs">
                
                <optgroup label="🌀 Pancha Bhoota Kshetras">
                  <option value="standard">Standard Yatra</option>
                  <option value="premium">Divine Premium Yatra</option>
                  <option value="vip">Cosmic VIP Yatra</option>
                </optgroup>

                <optgroup label="🔱 12 Jyotirlinga Yatras">
                  <option value="jyotirlinga_maha">Complete 12 Jyotirlinga Yatra</option>
                  <option value="jyotirlinga_somnath">Somnath & Dwarka Sacred Yatra</option>
                  <option value="jyotirlinga_south">Southern Jyotirlinga Circuit</option>
                </optgroup>

                <optgroup label="🏔️ Char Dham Circuits">
                  <option value="chota_chardham_full">Himalayan Chota Char Dham Yatra</option>
                  <option value="bada_chardham_full">Grand Bada Char Dham Yatra</option>
                </optgroup>

                <optgroup label="🛕 Individual Shrines">
                  <option value="ind_temple_custom">Customized Single-Temple Tour</option>
                </optgroup>

              </select>
            </div>

            <!-- Number of Pilgrims -->
            <div class="space-y-1">
              <label for="pilgrimsCount" class="text-slate-400">Pilgrims Count</label>
              <input type="number" id="pilgrimsCount" name="pilgrimsCount" required min="1" max="50" [(ngModel)]="formData.pilgrimsCount"
                     class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs"
                     placeholder="No. of people">
            </div>

            <!-- Start Date -->
            <div class="space-y-1">
              <label for="startDate" class="text-slate-400">Start Date</label>
              <input type="date" id="startDate" name="startDate" required [(ngModel)]="formData.startDate"
                     class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs">
            </div>
          </div>

          <!-- Special Requests -->
          <div class="space-y-1">
            <label for="message" class="text-slate-400">Special Requests / Notes</label>
            <textarea id="message" name="message" rows="3" [(ngModel)]="formData.message"
                      class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-spiritual-gold text-xs"
                      placeholder="Any details (e.g. food requirements, hotel preferences, pick-up location)..."></textarea>
          </div>

          <!-- Success Alert with reference code -->
          <div *ngIf="createdBookingRef" class="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs flex flex-col space-y-2">
            <span class="font-bold flex items-center">🎉 Yatra booked successfully!</span>
            <span>Your live tracking reference ID is: <strong class="select-all underline text-spiritual-gold text-sm">{{ createdBookingRef }}</strong></span>
            <span>Keep this ID safe! You can use it in the <strong>Track Trip</strong> menu to monitor your pilgrimage progress and live location.</span>
          </div>

          <!-- Submit Button -->
          <button type="submit" [disabled]="yatraForm.invalid || isSubmitting"
                  class="w-full sm:w-auto px-6 py-2.5 rounded-full saffron-gradient text-white text-xs font-semibold shadow hover:scale-102 transition duration-200 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-1.5">
            <span *ngIf="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isSubmitting ? 'Submitting Yatra...' : 'Confirm & Book Yatra' }}</span>
          </button>

        </form>
      </div>

    </div>
  `
})
export class BookingComponent implements OnInit {
  isSubmitting = false;
  activeCategory: 'panchabhoota' | 'jyotirlinga' | 'chardham' | 'individual' = 'panchabhoota';
  createdBookingRef = '';

  formData = {
    name: '',
    email: '',
    phone: '',
    package: 'standard',
    pilgrimsCount: 1,
    startDate: '',
    message: ''
  };

  packages: YatraPackage[] = [
    // Pancha Bhoota Packages
    {
      id: 'standard',
      category: 'panchabhoota',
      name: 'Standard Yatra',
      price: '₹14,999',
      subtitle: 'Shared Cosmic Elements Tour',
      badge: 'Economy Shrines',
      description: 'Shared group travel covering all five elemental Pancha Bhoota shrines.',
      accommodation: 'Comfortable Guest House (Non-AC)',
      transport: 'Shared AC bus coach transfers',
      meals: 'Traditional south Indian vegetarian food',
      poojaAccess: 'Standard quick darshan queue',
      inclusions: [
        'Transport across all 5 temples',
        'Shared guest house stay',
        'Quick darshan passes'
      ],
      gradientClass: 'saffron-gradient',
      btnClass: 'border border-spiritual-saffron text-spiritual-saffron hover:bg-spiritual-saffron hover:text-white'
    },
    {
      id: 'premium',
      category: 'panchabhoota',
      name: 'Divine Premium Yatra',
      price: '₹24,999',
      subtitle: 'Comfortable Guided Tour',
      badge: 'Popular Choice',
      description: 'Private car travel, 3-star hotel rooms, and guided element-pooja archana kits.',
      accommodation: '3-Star Hotel room (AC)',
      transport: 'Private SUV (Innova or similar)',
      meals: 'Buffet vegetarian breakfast & dinner',
      poojaAccess: 'VIP Entry passes + guided pujas',
      inclusions: [
        'Station/Airport private pick-up',
        '3-star AC hotel stay',
        'VIP quick entry darshan',
        'Local spiritual tour guide'
      ],
      gradientClass: 'gold-gradient',
      btnClass: 'saffron-gradient text-white shadow'
    },
    {
      id: 'vip',
      category: 'panchabhoota',
      name: 'Cosmic VIP Yatra',
      price: '₹44,999',
      subtitle: 'Luxury tour & private rituals',
      badge: 'Luxury Devotion',
      description: 'Full luxury transport, 5-star heritage stays, custom homas/pujas, and private yoga sessions.',
      accommodation: '5-Star Luxury resort suite',
      transport: 'Chauffeur-driven luxury SUV',
      meals: 'Organic Satvik meals included',
      poojaAccess: 'Immediate priority entry + personal homa',
      inclusions: [
        'Luxury private transfers',
        '5-star resort suite rooms',
        'Immediate VIP entry passes',
        'Custom private homa rituals',
        'Private morning yoga/meditation'
      ],
      gradientClass: 'bg-indigo-700',
      btnClass: 'bg-indigo-700 text-white hover:bg-indigo-850'
    },
    // 12 Jyotirlinga Packages
    {
      id: 'jyotirlinga_maha',
      category: 'jyotirlinga',
      name: 'Complete 12 Jyotirlinga Yatra',
      price: '₹89,999',
      subtitle: 'Pan-India Ultimate Pilgrimage',
      badge: 'Supreme Devotion',
      description: 'Cover all 12 sacred Jyotirlingas across India in a single grand spiritual journey.',
      accommodation: 'Premium 3-Star AC / Heritage Hotels',
      transport: 'Flight/Train connections + private AC sedan transfers',
      meals: 'Buffet Satvik meals (Pure Vegetarian)',
      poojaAccess: 'Direct VIP access + Abhishek reservation',
      inclusions: [
        'Interstate train/flight tickets',
        'Dedicated tour manager & pundit',
        'Pooja materials & Prasad delivery',
        'Special abhishek at Somnath & Kashi'
      ],
      gradientClass: 'bg-gradient-to-r from-red-600 to-orange-600',
      btnClass: 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90 shadow'
    },
    {
      id: 'jyotirlinga_somnath',
      category: 'jyotirlinga',
      name: 'Somnath & Dwarka Sacred Yatra',
      price: '₹29,999',
      subtitle: 'Western India Divine Circuit',
      badge: 'Siddha Kshetra',
      description: 'Pilgrimage to Somnath Jyotirlinga and the sacred city of Dwarkadhish temple.',
      accommodation: 'Executive AC Room near temple',
      transport: 'Dedicated private AC sedan cab',
      meals: 'Gujarati pure veg thalis & breakfasts',
      poojaAccess: 'Special evening Aarti priority entry',
      inclusions: [
        'Airport/Station pickup from Rajkot',
        'Light & Sound show entry ticket',
        'Abhishek pooja booking service',
        'Bet Dwarka ferry boat charges'
      ],
      gradientClass: 'gold-gradient',
      btnClass: 'border border-spiritual-gold text-spiritual-gold hover:bg-spiritual-gold hover:text-spiritual-dark'
    },
    {
      id: 'jyotirlinga_south',
      category: 'jyotirlinga',
      name: 'Southern Jyotirlinga Circuit',
      price: '₹34,999',
      subtitle: 'Srisailam, Rameswaram & Madurai',
      badge: 'Deccan Shrines',
      description: 'Devotional yatra to Mallikarjuna Swamy (Srisailam) and Ramanathaswamy (Rameswaram).',
      accommodation: 'Deluxe AC Rooms',
      transport: 'Comfortable private SUV transfers',
      meals: 'Traditional South Indian Satvik buffet',
      poojaAccess: 'Assisted Sparsha Darshan at Srisailam',
      inclusions: [
        'VIP Darshan entry passes',
        '22 wells sacred holy bath coordination',
        'Srisailam ropeway & boating tickets',
        'Driver allowance & toll taxes'
      ],
      gradientClass: 'saffron-gradient',
      btnClass: 'saffron-gradient text-white shadow'
    },
    // Char Dham Packages
    {
      id: 'chota_chardham_full',
      category: 'chardham',
      name: 'Himalayan Chota Char Dham',
      price: '₹49,999',
      subtitle: 'Yamunotri, Gangotri, Kedarnath & Badrinath',
      badge: 'Dev Bhumi Yatra',
      description: 'Purify your soul with the sacred Himalayan pilgrimage through spectacular peaks.',
      accommodation: 'Cozy Mountain hotels & cottages',
      transport: 'AC Tempo Traveller transfers on hills',
      meals: 'Warm Satvik organic vegetarian food',
      poojaAccess: 'Vedic Pooja and Maha Aarti access',
      inclusions: [
        'Kedarnath helicopter booking assistance',
        'Pony/Doli booking coordination',
        'Experienced mountain driver & guide',
        'Oxygen cylinder & medical kits'
      ],
      gradientClass: 'bg-gradient-to-r from-sky-500 to-indigo-600',
      btnClass: 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:opacity-90 shadow'
    },
    {
      id: 'bada_chardham_full',
      category: 'chardham',
      name: 'Grand Bada Char Dham',
      price: '₹79,999',
      subtitle: 'Badrinath, Dwarka, Puri, & Rameswaram',
      badge: 'Ultimate Liberation',
      description: 'A life-changing pilgrimage to the four corners of India representing the cosmic directions.',
      accommodation: 'Premium 3-Star AC hotels',
      transport: 'Air transfers + private SUV local transits',
      meals: 'Local vegetarian delicacies & Mahaprasad',
      poojaAccess: 'Special priority entry at all main shrines',
      inclusions: [
        'All domestic flights/trains included',
        'Exclusive temple guide coordinators',
        'Puri Jagannath Mahaprasad coupon',
        'Airport pick & drop services'
      ],
      gradientClass: 'bg-gradient-to-r from-purple-600 to-orange-500',
      btnClass: 'bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:opacity-90 shadow'
    },
    // Individual Tours
    {
      id: 'ind_temple_custom',
      category: 'individual',
      name: 'Custom Single-Temple Tour',
      price: '₹9,999',
      subtitle: 'Tailored Individual Pilgrimage',
      badge: 'Flexible Yatra',
      description: 'Pick any single temple from Pancha Bhoota or Jyotirlinga for a focused sacred visit.',
      accommodation: 'Deluxe/Standard AC room of choice',
      transport: 'Private hatchback/SUV pickup & drop',
      meals: 'Breakfast included (Pure Vegetarian)',
      poojaAccess: 'Assisted quick entry darshan',
      inclusions: [
        '100% customizable itinerary',
        'Local guide assistance at the shrine',
        'Special Archana pooja material kit',
        'Hotel-to-temple private drop'
      ],
      gradientClass: 'bg-slate-700',
      btnClass: 'bg-slate-800 text-white hover:bg-slate-900'
    }
  ];

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  get filteredPackages(): YatraPackage[] {
    return this.packages.filter(p => p.category === this.activeCategory);
  }

  selectPackage(packageId: string) {
    this.formData.package = packageId;
    // Find category to activate corresponding tab
    const pkg = this.packages.find(p => p.id === packageId);
    if (pkg) {
      this.activeCategory = pkg.category;
    }
    const formElement = document.getElementById('booking-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isSubmitting = true;
    this.createdBookingRef = '';
    const selectedPkg = this.packages.find(p => p.id === this.formData.package);
    const selectedPkgName = selectedPkg ? selectedPkg.name : this.formData.package;

    const submissionData = {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      packageId: this.formData.package,
      packageName: selectedPkgName,
      pilgrimsCount: this.formData.pilgrimsCount,
      startDate: this.formData.startDate,
      message: this.formData.message
    };

    this.apiService.createBooking(submissionData).subscribe({
      next: (response) => {
        if (response.success) {
          this.createdBookingRef = response.data._id;
          this.toastService.success('Yatra booked successfully! Save your Reference ID below.');
          form.resetForm();
          this.formData = {
            name: '',
            email: '',
            phone: '',
            package: 'standard',
            pilgrimsCount: 1,
            startDate: '',
            message: ''
          };
        } else {
          this.toastService.error('Failed to register booking. Try again.');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.message || 'Server connection failed.');
        this.isSubmitting = false;
      }
    });
  }
}
