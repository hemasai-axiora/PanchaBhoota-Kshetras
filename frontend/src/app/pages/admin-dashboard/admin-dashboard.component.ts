import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in font-sans">
      
      <!-- Dashboard Title Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-serif font-bold text-spiritual-saffron">Admin Control Panel</h1>
          <p class="text-xs text-slate-400 font-medium">Control temple listings, edit elements, and manage contact messages.</p>
        </div>
        
        <button 
          *ngIf="activeTab === 'temples' && !isFormOpen" 
          (click)="openAddForm()"
          class="px-5 py-2.5 rounded-full saffron-gradient text-white text-xs font-semibold hover:opacity-90 transition flex items-center space-x-1.5 self-start">
          <span>+ Add New Temple</span>
        </button>
      </div>

      <!-- Tab Selectors -->
      <div class="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-8">
        <button 
          (click)="activeTab = 'temples'; isFormOpen = false"
          [ngClass]="activeTab === 'temples' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 text-sm font-medium border-b-2 transition duration-200 flex items-center space-x-2">
          <span>🛕 Temples Listings</span>
        </button>
        <button 
          (click)="activeTab = 'contacts'; isFormOpen = false"
          [ngClass]="activeTab === 'contacts' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 text-sm font-medium border-b-2 transition duration-200 flex items-center space-x-2">
          <span>✉️ Seekers Inbox</span>
          <span *ngIf="unreadCount > 0" class="px-2 py-0.5 text-[10px] font-bold saffron-gradient text-white rounded-full">
            {{ unreadCount }}
          </span>
        </button>
      </div>

      <!-- ==================== TABS CONTENT: TEMPLES ==================== -->
      <div *ngIf="activeTab === 'temples'">
        
        <!-- Temple Form Add/Edit Overlay Block -->
        <div *ngIf="isFormOpen" class="bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8 animate-fade-in space-y-6">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 class="text-xl font-serif font-bold text-spiritual-gold">
              {{ editingTempleId ? 'Modify Manifestation' : 'Add New Element Manifestation' }}
            </h2>
            <button (click)="closeForm()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 text-sm font-bold">
              Cancel &times;
            </button>
          </div>

          <form (ngSubmit)="saveTemple()" class="space-y-6 text-xs font-medium">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <!-- Name -->
              <div class="space-y-1">
                <label class="text-slate-400">Temple Name</label>
                <input type="text" [(ngModel)]="templeForm.name" name="name" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Ekambareswarar Temple">
              </div>

              <!-- Element -->
              <div class="space-y-1">
                <label class="text-slate-400">Primal Element</label>
                <select [(ngModel)]="templeForm.element" name="element" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  <option value="Earth">Earth</option>
                  <option value="Water">Water</option>
                  <option value="Fire">Fire</option>
                  <option value="Air">Air</option>
                  <option value="Space">Space</option>
                </select>
              </div>

              <!-- Element Sanskrit -->
              <div class="space-y-1">
                <label class="text-slate-400">Sanskrit Element Name</label>
                <input type="text" [(ngModel)]="templeForm.elementSanskrit" name="elementSanskrit" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Prithvi">
              </div>

              <!-- Deity -->
              <div class="space-y-1">
                <label class="text-slate-400">Main Deity Name</label>
                <input type="text" [(ngModel)]="templeForm.deity" name="deity" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Lord Ekambareswarar">
              </div>

              <!-- Consort -->
              <div class="space-y-1">
                <label class="text-slate-400">Consort</label>
                <input type="text" [(ngModel)]="templeForm.consort" name="consort" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Goddess Kamakshi Amman">
              </div>

              <!-- City / Location -->
              <div class="space-y-1">
                <label class="text-slate-400">Location City</label>
                <input type="text" [(ngModel)]="templeForm.location" name="location" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Kanchipuram">
              </div>

              <!-- State -->
              <div class="space-y-1">
                <label class="text-slate-400">State</label>
                <input type="text" [(ngModel)]="templeForm.state" name="state" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Tamil Nadu">
              </div>

              <!-- Timings Morning -->
              <div class="space-y-1">
                <label class="text-slate-400">Morning Timings</label>
                <input type="text" [(ngModel)]="templeForm.timings.morning" name="morningTimings" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. 6:00 AM - 12:30 PM">
              </div>

              <!-- Timings Evening -->
              <div class="space-y-1">
                <label class="text-slate-400">Evening Timings</label>
                <input type="text" [(ngModel)]="templeForm.timings.evening" name="eveningTimings" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. 4:00 PM - 8:30 PM">
              </div>

              <!-- Latitude -->
              <div class="space-y-1">
                <label class="text-slate-400">Map Latitude</label>
                <input type="number" step="any" [(ngModel)]="templeForm.latitude" name="latitude" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. 12.8465">
              </div>

              <!-- Longitude -->
              <div class="space-y-1">
                <label class="text-slate-400">Map Longitude</label>
                <input type="number" step="any" [(ngModel)]="templeForm.longitude" name="longitude" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. 79.6998">
              </div>

              <!-- Map Embed URL -->
              <div class="space-y-1 sm:col-span-2">
                <label class="text-slate-400">Google Map Embed URL</label>
                <input type="text" [(ngModel)]="templeForm.mapUrl" name="mapUrl" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="https://www.google.com/maps/embed?...">
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-1">
              <label class="text-slate-400">Detailed Description</label>
              <textarea [(ngModel)]="templeForm.description" name="description" rows="3" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="Write general description..."></textarea>
            </div>

            <!-- History -->
            <div class="space-y-1">
              <label class="text-slate-400">Legends & Sacred History</label>
              <textarea [(ngModel)]="templeForm.history" name="history" rows="4" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="Write historic backgrounds..."></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Powers (comma separated input) -->
              <div class="space-y-1">
                <label class="text-slate-400">Spiritual Powers (comma-separated list)</label>
                <input type="text" [(ngModel)]="powersCsv" name="powers" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="Stability, Wisdom, Karmic clearance...">
              </div>

              <!-- Festivals (comma separated input) -->
              <div class="space-y-1">
                <label class="text-slate-400">Celebrated Festivals (comma-separated list)</label>
                <input type="text" [(ngModel)]="festivalsCsv" name="festivals" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="Shivaratri, Panguni Uthiram, Pradosham...">
              </div>
            </div>

            <!-- Images (comma separated list) -->
            <div class="space-y-1">
              <label class="text-slate-400">Sacred Image URLs (comma-separated list)</label>
              <input type="text" [(ngModel)]="imagesCsv" name="images" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="http://url-to-image1, http://url-to-image2...">
            </div>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button type="button" (click)="closeForm()" class="px-5 py-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition font-bold text-slate-500">
                Cancel
              </button>
              <button type="submit" class="px-7 py-3 rounded-full saffron-gradient text-white font-bold hover:opacity-90 shadow-md">
                {{ editingTempleId ? 'Update Record' : 'Save Record' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Temples Grid Management Table -->
        <div class="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-800">
                  <th class="py-4 px-6 font-semibold">Temple Details</th>
                  <th class="py-4 px-6 font-semibold">Manifestation</th>
                  <th class="py-4 px-6 font-semibold">Deity Details</th>
                  <th class="py-4 px-6 font-semibold">Location</th>
                  <th class="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-sans">
                <tr *ngFor="let temple of templesList" class="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors duration-150">
                  
                  <!-- Title & Image preview -->
                  <td class="py-4 px-6 flex items-center space-x-3 min-w-[240px]">
                    <img [src]="temple.images[0]" [alt]="temple.name" class="w-12 h-12 object-cover rounded-lg">
                    <span class="font-serif font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {{ temple.name }}
                    </span>
                  </td>

                  <!-- Elementsrepresented -->
                  <td class="py-4 px-6 font-semibold text-spiritual-saffron">
                    {{ temple.element }} ({{ temple.elementSanskrit }})
                  </td>

                  <!-- Deity -->
                  <td class="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">
                    {{ temple.deity }}
                  </td>

                  <!-- City -->
                  <td class="py-4 px-6 text-slate-500 font-light">
                    {{ temple.location }}, {{ temple.state }}
                  </td>

                  <!-- Actions buttons -->
                  <td class="py-4 px-6 text-center space-x-2 min-w-[160px]">
                    <button 
                      (click)="onEditTemple(temple)"
                      class="px-3 py-1.5 rounded-full border border-spiritual-gold text-spiritual-gold hover:bg-spiritual-gold hover:text-spiritual-dark text-[10px] font-bold transition">
                      Edit
                    </button>
                    <button 
                      (click)="onDeleteTemple(temple._id)"
                      class="px-3 py-1.5 rounded-full border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-bold transition">
                      Delete
                    </button>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ==================== TABS CONTENT: INQUIRIES ==================== -->
      <div *ngIf="activeTab === 'contacts'">
        
        <div class="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 class="text-xl font-serif font-bold text-spiritual-gold">Message Mailbox</h2>
            <span class="text-xs text-slate-400 font-medium">Click to change read state or remove listings</span>
          </div>

          <!-- Empty Mailbox -->
          <div *ngIf="contactsList.length === 0" class="text-center py-20 space-y-3">
            <span class="text-4xl">📭</span>
            <h3 class="text-lg font-bold font-serif">Inbox Empty</h3>
            <p class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              No spiritual messages or pilgrimage inquiries have been logged in the database yet.
            </p>
          </div>

          <!-- Message Table -->
          <div *ngIf="contactsList.length > 0" class="overflow-x-auto animate-fade-in">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-800">
                  <th class="py-4 px-6 font-semibold">Seeker Details</th>
                  <th class="py-4 px-6 font-semibold">Subject & Message</th>
                  <th class="py-4 px-6 font-semibold">Submission Date</th>
                  <th class="py-4 px-6 font-semibold">Status</th>
                  <th class="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-sans">
                <tr *ngFor="let contact of contactsList" class="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all duration-150">
                  
                  <!-- Sender -->
                  <td class="py-4 px-6 min-w-[180px]">
                    <p class="font-bold text-slate-800 dark:text-slate-100">{{ contact.name }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5 select-all">{{ contact.email }}</p>
                  </td>

                  <!-- Message content -->
                  <td class="py-4 px-6 max-w-md">
                    <p class="font-bold text-slate-700 dark:text-slate-200 mb-1">{{ contact.subject }}</p>
                    <p class="text-slate-500 dark:text-slate-400 font-light leading-relaxed whitespace-pre-line">{{ contact.message }}</p>
                  </td>

                  <!-- Date -->
                  <td class="py-4 px-6 text-slate-400 font-light whitespace-nowrap">
                    {{ contact.createdAt | date:'mediumDate' }}<br>
                    <span class="text-[10px] opacity-70">{{ contact.createdAt | date:'shortTime' }}</span>
                  </td>

                  <!-- Status -->
                  <td class="py-4 px-6">
                    <button 
                      (click)="toggleReadStatus(contact)"
                      [ngClass]="contact.status === 'Read' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/30' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200/50 dark:border-rose-800/30'"
                      class="px-3 py-1 rounded-full text-[10px] font-bold uppercase transition">
                      {{ contact.status }}
                    </button>
                  </td>

                  <!-- Delete -->
                  <td class="py-4 px-6 text-center">
                    <button 
                      (click)="onDeleteContact(contact._id)"
                      class="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 transition">
                      🗑️
                    </button>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'temples';
  templesList: any[] = [];
  contactsList: any[] = [];
  unreadCount = 0;

  // Form handling
  isFormOpen = false;
  editingTempleId: string | null = null;
  
  templeForm = this.getDefaultForm();
  
  powersCsv = '';
  festivalsCsv = '';
  imagesCsv = '';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.getTemples().subscribe({
      next: (res) => {
        if (res.success) {
          this.templesList = res.data;
        }
      }
    });

    this.apiService.getContacts().subscribe({
      next: (res) => {
        if (res.success) {
          this.contactsList = res.data;
          this.unreadCount = this.contactsList.filter(c => c.status === 'Unread').length;
        }
      }
    });
  }

  getDefaultForm() {
    return {
      name: '',
      element: 'Earth',
      elementSanskrit: '',
      deity: '',
      consort: '',
      location: '',
      state: '',
      description: '',
      history: '',
      powers: [] as string[],
      timings: {
        morning: '',
        evening: ''
      },
      festivals: [] as string[],
      images: [] as string[],
      latitude: null as number | null,
      longitude: null as number | null,
      mapUrl: '',
      featured: true
    };
  }

  openAddForm() {
    this.editingTempleId = null;
    this.templeForm = this.getDefaultForm();
    this.powersCsv = '';
    this.festivalsCsv = '';
    this.imagesCsv = '';
    this.isFormOpen = true;
  }

  onEditTemple(temple: any) {
    this.editingTempleId = temple._id;
    this.templeForm = {
      name: temple.name,
      element: temple.element,
      elementSanskrit: temple.elementSanskrit,
      deity: temple.deity,
      consort: temple.consort,
      location: temple.location,
      state: temple.state,
      description: temple.description,
      history: temple.history,
      powers: [...temple.powers],
      timings: {
        morning: temple.timings.morning,
        evening: temple.timings.evening
      },
      festivals: [...temple.festivals],
      images: [...temple.images],
      latitude: temple.coordinates.latitude,
      longitude: temple.coordinates.longitude,
      mapUrl: temple.mapUrl,
      featured: temple.featured
    };

    this.powersCsv = temple.powers.join(', ');
    this.festivalsCsv = temple.festivals.join(', ');
    this.imagesCsv = temple.images.join(', ');
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
  }

  saveTemple() {
    // Process CSV strings
    this.templeForm.powers = this.powersCsv.split(',').map(s => s.trim()).filter(Boolean);
    this.templeForm.festivals = this.festivalsCsv.split(',').map(s => s.trim()).filter(Boolean);
    this.templeForm.images = this.imagesCsv.split(',').map(s => s.trim()).filter(Boolean);

    if (this.editingTempleId) {
      // Update
      this.apiService.updateTemple(this.editingTempleId, this.templeForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.success('Temple details updated successfully.');
            this.isFormOpen = false;
            this.fetchData();
          }
        },
        error: (err) => this.toastService.error(err.message || 'Updating temple failed.')
      });
    } else {
      // Create
      this.apiService.createTemple(this.templeForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.success('New element temple added successfully.');
            this.isFormOpen = false;
            this.fetchData();
          }
        },
        error: (err) => this.toastService.error(err.message || 'Creating temple failed.')
      });
    }
  }

  onDeleteTemple(id: string) {
    if (!confirm('Are you absolutely certain you want to delete this sacred temple record?')) return;

    this.apiService.deleteTemple(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Temple record removed successfully.');
          this.fetchData();
        }
      },
      error: (err) => this.toastService.error(err.message || 'Removing temple failed.')
    });
  }

  toggleReadStatus(contact: any) {
    const newStatus = contact.status === 'Read' ? 'Unread' : 'Read';
    this.apiService.updateContactStatus(contact._id, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.info(`Message status updated to ${newStatus}`);
          this.fetchData();
        }
      }
    });
  }

  onDeleteContact(id: string) {
    if (!confirm('Permanently delete this seeker query message?')) return;

    this.apiService.deleteContact(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Pilgrim query message deleted.');
          this.fetchData();
        }
      }
    });
  }
}
