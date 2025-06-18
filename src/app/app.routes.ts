import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'hetails/:id',
    loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
