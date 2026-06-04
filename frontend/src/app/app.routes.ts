import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Yatra — Home'
  },
  {
    path: 'temples',
    loadComponent: () => import('./pages/temples-list/temples-list.component').then(m => m.TemplesListComponent),
    title: 'Yatra — Sacred Temples Directory'
  },
  {
    path: 'temples/:id',
    loadComponent: () => import('./pages/temple-detail/temple-detail.component').then(m => m.TempleDetailComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Yatra — Divine Art & Gallery'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Yatra — About Cosmic Elements'
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
    title: 'Yatra — Book Tour Packages'
  },
  {
    path: 'track',
    loadComponent: () => import('./pages/trip-tracking/trip-tracking.component').then(m => m.TripTrackingComponent),
    title: 'Yatra — Live Trip Tracking'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Yatra — Contact & Inquiries'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Yatra — Admin Login'
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    title: 'Yatra — Admin Dashboard'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
