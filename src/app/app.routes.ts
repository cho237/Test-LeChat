import { Routes } from '@angular/router';

import { ArticlesComponent } from './pages/articles/articles.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ArticlesComponent,
  },
 

  {
    path: 'products',
    pathMatch: 'full',
    component: ProductsComponent,
  },
];
