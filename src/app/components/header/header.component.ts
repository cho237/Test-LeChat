import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div
      class="bg-orange-400 px-16 md:px-24 lg:px-64 xl:px-90 py-3 shadow flex justify-between items-center"
    >
      <a
        routerLink="/"
        routerLinkActive="underline"
        [routerLinkActiveOptions]="{ exact: true }"
        class="text-xl text-white cursor-pointer"
      >
        My Articles
      </a>
      <button
        routerLink="/products"
        routerLinkActive="underline"
        class="text-xl text-white cursor-pointer"
      >
        Products
      </button>
    </div>
  `,
  styles: ``,
})
export class HeaderComponent {}
