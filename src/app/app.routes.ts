import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ArticlesComponent,
  },
  {
    path: 'admin',
    pathMatch: 'full',
    component: HomeComponent,
  },

  {
    path: 'products',
    pathMatch: 'full',
    component: ProductsComponent,
  },
];
