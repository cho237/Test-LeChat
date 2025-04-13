import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <div
      class="bg-orange-400 px-16 md:px-24 lg:px-64 xl:px-90 py-3 shadow flex justify-between items-center"
    >
      <button routerLink="/" class="text-xl text-white cursor-pointer">
        My Articles
      </button>
      <button routerLink="/products" class="text-xl text-white cursor-pointer">
        Products
      </button>
    </div>
  `,
  styles: ``,
})
export class HeaderComponent {}
