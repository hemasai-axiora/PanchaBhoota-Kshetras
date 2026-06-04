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
      <div class="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-8 overflow-x-auto">
        <button 
          (click)="activeTab = 'temples'; isFormOpen = false"
          [ngClass]="activeTab === 'temples' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 text-sm font-medium border-b-2 transition duration-200 flex items-center space-x-2 whitespace-nowrap">
          <span>🛕 Temples Listings</span>
        </button>
        <button 
          (click)="activeTab = 'bookings'; isFormOpen = false"
          [ngClass]="activeTab === 'bookings' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 text-sm font-medium border-b-2 transition duration-200 flex items-center space-x-2 whitespace-nowrap">
          <span>🗺️ Yatra Bookings & GPS</span>
        </button>
        <button 
          (click)="activeTab = 'contacts'; isFormOpen = false"
          [ngClass]="activeTab === 'contacts' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 text-sm font-medium border-b-2 transition duration-200 flex items-center space-x-2 whitespace-nowrap">
          <span>✉️ Seekers Inbox</span>
          <span *ngIf="unreadCount > 0" class="px-2 py-0.5 text-[10px] font-bold saffron-gradient text-white rounded-full">
            {{ unreadCount }}
          </span>
        </button>
        <button 
          (click)="activeTab = 'agents'; isFormOpen = false"
          [ngClass]="activeTab === 'agents' ? 'border-spiritual-saffron text-spiritual-saffron font-bold' : 'border-transparent text-slate-400 dark:text-slate-500'"
          class="pb-3 text-sm font-medium border-b-2 transition duration-200 flex items-center space-x-2 whitespace-nowrap">
          <span>👥 Agent Team</span>
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
                    <p *ngIf="contact.phone" class="text-[10px] text-spiritual-saffron mt-0.5 select-all font-semibold">📞 {{ contact.phone }}</p>
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

                  <!-- Status & Agent Assignment -->
                  <td class="py-4 px-6 min-w-[160px]">
                    <div class="flex flex-col space-y-2">
                      <button 
                        (click)="toggleReadStatus(contact)"
                        [ngClass]="contact.status === 'Read' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/30' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200/50 dark:border-rose-800/30'"
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase transition self-start">
                        {{ contact.status }}
                      </button>
                      
                      <div class="space-y-1">
                        <label class="text-[9px] uppercase text-slate-400 font-bold block">Assigned Agent</label>
                        <select 
                          (change)="onAssignAgent(contact._id, $event)" 
                          class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-[10px] font-semibold text-slate-600 dark:text-slate-400 dark:bg-slate-900 focus:outline-none">
                          <option value="">-- Unassigned --</option>
                          <option 
                            *ngFor="let agent of agentsList" 
                            [value]="agent.id" 
                            [selected]="contact.assignedAgent?.id === agent.id">
                            {{ agent.name }}
                          </option>
                        </select>
                      </div>
                    </div>
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

      <!-- ==================== TABS CONTENT: BOOKINGS & GPS ==================== -->
      <div *ngIf="activeTab === 'bookings'" class="space-y-8 animate-fade-in">
        
        <!-- Live GPS Tracking Form (Active when a booking is selected) -->
        <div *ngIf="activeBookingForm" class="bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 class="text-xl font-serif font-bold text-spiritual-gold flex items-center gap-2">
              <span>📍</span> Update Live GPS: {{ activeBookingForm.name }} ({{ activeBookingForm.packageName }})
            </h2>
            <button (click)="activeBookingForm = null" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 text-sm font-bold">
              Cancel &times;
            </button>
          </div>

          <form (ngSubmit)="saveBookingChanges()" class="space-y-4 text-xs font-medium">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              
              <!-- Status -->
              <div class="space-y-1">
                <label class="text-slate-400">Yatra Status</label>
                <select [(ngModel)]="bookingEditForm.status" name="status" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Level / Stage -->
              <div class="space-y-1">
                <label class="text-slate-400">Progress Level / Stage</label>
                <input type="text" [(ngModel)]="bookingEditForm.currentLevel" name="currentLevel" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Earth Element Visited">
              </div>

              <!-- Latitude -->
              <div class="space-y-1">
                <label class="text-slate-400">GPS Latitude</label>
                <input type="number" step="any" [(ngModel)]="bookingEditForm.liveTracking.latitude" name="latitude" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100">
              </div>

              <!-- Longitude -->
              <div class="space-y-1">
                <label class="text-slate-400">GPS Longitude</label>
                <input type="number" step="any" [(ngModel)]="bookingEditForm.liveTracking.longitude" name="longitude" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100">
              </div>

            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <!-- Current City -->
              <div class="space-y-1">
                <label class="text-slate-400">Current City / Stop</label>
                <input type="text" [(ngModel)]="bookingEditForm.liveTracking.currentCity" name="currentCity" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Kanchipuram">
              </div>

              <!-- Remarks -->
              <div class="space-y-1 sm:col-span-2">
                <label class="text-slate-400">Tracking Remarks / Log Message</label>
                <input type="text" [(ngModel)]="bookingEditForm.liveTracking.remarks" name="remarks" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100" placeholder="e.g. Arrived safely at the guest house.">
              </div>

            </div>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button type="button" (click)="activeBookingForm = null" class="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition font-bold text-slate-500">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2.5 rounded-full saffron-gradient text-white font-bold hover:opacity-90 shadow-md">
                Save Tracking & Status
              </button>
            </div>
          </form>
        </div>

        <!-- Bookings List Table -->
        <div class="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <h2 class="text-xl font-serif font-bold text-spiritual-gold">Pilgrimage Bookings Register</h2>
            <span class="text-xs text-slate-400 font-medium">Select booking to update level progress and live coordinates.</span>
          </div>

          <!-- Empty State -->
          <div *ngIf="bookingsList.length === 0" class="text-center py-20 space-y-3">
            <span class="text-4xl">🧳</span>
            <h3 class="text-lg font-bold font-serif">No Bookings Logged</h3>
            <p class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              No tour packages have been booked yet. Active requests will register here automatically.
            </p>
          </div>

          <!-- Table -->
          <div *ngIf="bookingsList.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-800">
                  <th class="py-4 px-6 font-semibold">Ref ID & Customer</th>
                  <th class="py-4 px-6 font-semibold">Selected Yatra</th>
                  <th class="py-4 px-6 font-semibold">StartDate & Pilgrims</th>
                  <th class="py-4 px-6 font-semibold">Status & Stage</th>
                  <th class="py-4 px-6 font-semibold">Last GPS Position</th>
                  <th class="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-sans">
                <tr *ngFor="let booking of bookingsList" class="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors duration-150">
                  
                  <!-- ID & Customer -->
                  <td class="py-4 px-6 min-w-[180px]">
                    <p class="font-bold text-slate-800 dark:text-slate-100">{{ booking.name }}</p>
                    <p class="text-[10px] text-slate-400 select-all font-mono">{{ booking._id }}</p>
                    <p class="text-[10px] text-slate-500 select-all">{{ booking.email }} | {{ booking.phone }}</p>
                  </td>

                  <!-- Yatra package details -->
                  <td class="py-4 px-6 font-medium text-slate-800 dark:text-slate-100">
                    <span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-900 text-spiritual-gold font-bold block w-fit mb-1">
                      {{ booking.packageId }}
                    </span>
                    {{ booking.packageName }}
                  </td>

                  <!-- Date & Pilgrims Count -->
                  <td class="py-4 px-6 text-slate-500 font-light">
                    <p class="font-semibold text-slate-700 dark:text-slate-300">👥 {{ booking.pilgrimsCount }} pilgrims</p>
                    <p class="text-[10px] mt-0.5">Start: {{ booking.startDate | date:'mediumDate' }}</p>
                  </td>

                  <!-- Status & Level -->
                  <td class="py-4 px-6">
                    <span [ngClass]="{
                      'bg-orange-50 text-orange-600 border border-orange-200/50': booking.status === 'Pending',
                      'bg-sky-50 text-sky-600 border border-sky-200/50': booking.status === 'Confirmed',
                      'bg-emerald-50 text-emerald-600 border border-emerald-200/50': booking.status === 'Active',
                      'bg-purple-50 text-purple-600 border border-purple-200/50': booking.status === 'Completed',
                      'bg-rose-50 text-rose-600 border border-rose-200/50': booking.status === 'Cancelled'
                    }" class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase block w-fit mb-1">
                      {{ booking.status }}
                    </span>
                    <p class="text-[11px] font-bold text-spiritual-saffron font-serif">{{ booking.currentLevel }}</p>
                  </td>

                  <!-- GPS Position -->
                  <td class="py-4 px-6 text-slate-500 font-light">
                    <p class="font-semibold text-slate-800 dark:text-slate-200">📍 {{ booking.liveTracking?.currentCity || 'Awaiting' }}</p>
                    <p class="text-[10px] font-mono opacity-80" *ngIf="booking.liveTracking?.latitude">
                      {{ booking.liveTracking.latitude | number:'1.2-2' }}, {{ booking.liveTracking.longitude | number:'1.2-2' }}
                    </p>
                  </td>

                  <!-- Actions -->
                  <td class="py-4 px-6 text-center space-x-2 whitespace-nowrap min-w-[150px]">
                    <button 
                      (click)="onSelectBooking(booking)"
                      class="px-3 py-1.5 rounded-full border border-spiritual-gold text-spiritual-gold hover:bg-spiritual-gold hover:text-spiritual-dark text-[10px] font-bold transition">
                      GPS / Level
                    </button>
                    <button 
                      (click)="onDeleteBooking(booking._id)"
                      class="p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 transition align-middle">
                      🗑️
                    </button>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ==================== TABS CONTENT: AGENTS ==================== -->
      <div *ngIf="activeTab === 'agents'" class="animate-fade-in space-y-6">
        <div class="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow">
          <div class="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h2 class="text-xl font-serif font-bold text-spiritual-gold">Sacred Pilgrimage Agents & Facilitators</h2>
            <p class="text-xs text-slate-400 font-medium">These certified team members guide pilgrims, organize custom elements rituals, and coordinate travel logistics.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let agent of agentsList" 
                 class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 relative overflow-hidden flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <span class="text-[9px] uppercase font-bold text-spiritual-saffron tracking-wider px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/45 inline-block">
                  {{ agent.role }}
                </span>
                <h3 class="text-lg font-serif font-bold text-slate-800 dark:text-slate-100 pt-1">{{ agent.name }}</h3>
                <p class="text-xs font-semibold text-spiritual-gold">Specialty: {{ agent.specialty }}</p>
                <div class="pt-2 text-xs space-y-1 font-light text-slate-500 dark:text-slate-400 border-t border-slate-150 dark:border-slate-800/50">
                  <p>📞 Phone: {{ agent.phone }}</p>
                  <p>✉️ Email: {{ agent.email }}</p>
                </div>
              </div>
            </div>
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
  bookingsList: any[] = [];
  unreadCount = 0;

  activeBookingForm: any = null;
  bookingEditForm = {
    status: '',
    currentLevel: '',
    liveTracking: {
      latitude: 20.5937,
      longitude: 78.9629,
      currentCity: '',
      remarks: ''
    }
  };

  agentsList = [
    { id: 'agent_1', name: 'Swami Rakesh', role: 'Yatra Coordinator', phone: '+91 98765 43210', specialty: 'Temple Darshans & Routing', email: 'rakesh.coordinator@panchabhoota.org' },
    { id: 'agent_2', name: 'Acharya Anand', role: 'Vedic Rituals Guide', phone: '+91 98765 43211', specialty: 'Temple Pujas & Homas', email: 'anand.ritualguide@panchabhoota.org' },
    { id: 'agent_3', name: 'Shakti Devi', role: 'Sadhana Facilitator', phone: '+91 98765 43212', specialty: 'Yoga & Element Meditation', email: 'shakti.yoga@panchabhoota.org' }
  ];

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

    this.apiService.getBookings().subscribe({
      next: (res) => {
        if (res.success) {
          this.bookingsList = res.data;
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
    this.apiService.updateContactStatus(contact._id, { status: newStatus }).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.info(`Message status updated to ${newStatus}`);
          this.fetchData();
        }
      }
    });
  }

  onAssignAgent(contactId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedAgentId = selectElement.value;
    const selectedAgentObj = this.agentsList.find(a => a.id === selectedAgentId) || null;

    this.apiService.updateContactStatus(contactId, { assignedAgent: selectedAgentObj }).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(selectedAgentObj ? `Agent ${selectedAgentObj.name} assigned successfully.` : 'Agent unassigned.');
          this.fetchData();
        }
      },
      error: (err) => this.toastService.error(err.message || 'Assigning agent failed.')
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

  onSelectBooking(booking: any) {
    this.activeBookingForm = booking;
    this.bookingEditForm = {
      status: booking.status,
      currentLevel: booking.currentLevel,
      liveTracking: {
        latitude: booking.liveTracking?.latitude !== undefined ? booking.liveTracking.latitude : 20.5937,
        longitude: booking.liveTracking?.longitude !== undefined ? booking.liveTracking.longitude : 78.9629,
        currentCity: booking.liveTracking?.currentCity || '',
        remarks: booking.liveTracking?.remarks || ''
      }
    };
  }

  saveBookingChanges() {
    if (!this.activeBookingForm) return;
    this.apiService.updateBooking(this.activeBookingForm._id, this.bookingEditForm).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Yatra booking status & GPS tracking updated successfully.');
          this.activeBookingForm = null;
          this.fetchData();
        }
      },
      error: (err) => this.toastService.error(err.message || 'Failed to update yatra status.')
    });
  }

  onDeleteBooking(id: string) {
    if (!confirm('Are you absolutely certain you want to cancel and delete this yatra booking?')) return;
    this.apiService.deleteBooking(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Yatra booking record removed.');
          this.fetchData();
        }
      },
      error: (err) => this.toastService.error(err.message || 'Failed to delete booking.')
    });
  }
}
