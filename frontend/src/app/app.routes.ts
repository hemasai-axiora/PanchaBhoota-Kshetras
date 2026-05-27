import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'PanchaBhoota Kshetras — Home'
  },
  {
    path: 'temples',
    loadComponent: () => import('./pages/temples-list/temples-list.component').then(m => m.TemplesListComponent),
    title: 'Sacred Temples Directory'
  },
  {
    path: 'temples/:id',
    loadComponent: () => import('./pages/temple-detail/temple-detail.component').then(m => m.TempleDetailComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Divine Art & Images Gallery'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About Pancha Bhoota Cosmic Elements'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact and Pilgrimage Inquiries'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Control Center Login'
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    title: 'Admin Control Dashboard'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
