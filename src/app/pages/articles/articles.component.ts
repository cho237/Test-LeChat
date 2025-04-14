import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Article, Category, Product } from '../../models';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-articles',
  imports: [CommonModule, FormsModule],
  template: `
    <div class=" px-16 md:px-24 lg:px-64 xl:px-90 py-6 ">
      <div class="flex gap-4">
        <div class="w-full">
          <div class="mb-8">
            <h1>Articles</h1>
            <div class="h-1 w-full bg-orange-400 "></div>
          </div>

          @if(fetchingArticles()){
          <p class="text-center italic ">loading...</p>
          } @if(!fetchingArticles() && articles().length < 1){
          <p class="text-center italic ">No article yet</p>
          } @if(!fetchingArticles() && articles().length > 0){
          <div class="max-h-[40rem] overflow-auto">
            @for (article of articles(); track article.id) {
            <div class="border-t border-b border-gray-300 py-2">
              <div (click)="showProductArticle(article)" class="cursor-pointer">
                <p class="text-md font-bold mb-2">{{ article.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ article.description }}
                </p>
                @if(article.active){
                <p class="text-sm text-green-500 mb-2">Active</p>
                } @else {
                <p class="text-sm text-red-500 mb-2">Inactive</p>
                }

                <div class="flex justify-between">
                  <p class="text-xs text-gray-500 font-bold">
                    [ {{ getProduct(article.product) }} ]
                  </p>
                  <p class="font-bold">$ {{ article.price }}</p>
                </div>
              </div>
              <div class="flex justify-end gap-2 text-xs mt-2">
                <p
                  (click)="startEditArticle(article)"
                  class="cursor-pointer underline "
                >
                  Edit
                </p>
                <p
                  (click)="deleteArticle(article.id!)"
                  class="cursor-pointer underline text-red-500"
                >
                  Delete
                </p>
              </div>
            </div>
            }
          </div>
          }
          <div class="mt-2">
            <p
              (click)="setActiveForm(1)"
              class="cursor-pointer underline text-xs text-blue-500"
            >
              Add Article
            </p>
          </div>
        </div>

        <!-- add article -->
        @if(leftForm()){
        <div class="w-full px-8 py-4 ">
          @if(activeForm() === 1){
          <form
            #articleForm="ngForm"
            class="border border-gray-200 p-4"
            action=""
          >
            <div class="flex justify-between ">
              <h1 class="mb-2 text-xl">
                @if(editMode()){ Edit Article }@else{ Add Article }
              </h1>
              <div (click)="leftForm.set(false)" class="cursor-pointer">x</div>
            </div>

            <div class="relative z-0 w-full mb-2 group">
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="article.name"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Please Enter name"
                required
              />
            </div>
            <div class="relative z-0 w-full mb-2 group">
              <input
                type="text"
                id="desription"
                name="description"
                [(ngModel)]="article.description"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Please Enter description"
                required
              />
            </div>

            <div class="relative z-0 w-full mb-2 group">
              <label for="" class="text-xs font-bold">Enter Price </label>
              <input
                type="number"
                id="price"
                name="price"
                [(ngModel)]="article.price"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Please Enter price"
                min="0"
                max="99"
                maxlength="2"
                required
              />
            </div>

            <div class="mt-2">
              <label for="" class="text-xs font-bold">Select Active </label>
              <select
                id="active"
                name="active"
                [(ngModel)]="article.active"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div class="mt-2">
              <label for="" class="text-xs font-bold">Select Product</label>
              <select
                id="cat"
                name="cat"
                [(ngModel)]="article.product"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
              >
                @for (product of products(); track product.id) {

                <option value="{{ product.id }}">
                  {{ product.name }}
                </option>
                }
              </select>
            </div>

            <div class="flex gap-4 mt-8">
              <button
                (click)="saveArticle()"
                [disabled]="!articleForm.valid || laodingArticle()"
                class="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full px-5 py-2.5 text-center cursor-pointer"
              >
                Sauvegarde
              </button>

              <button
                (click)="resetArticle()"
                class="text-white bg-red-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm w-full px-5 py-2.5 text-center cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>
          } @if(activeForm() === 2){ } @if(activeForm() === 3){
          <div class="border border-gray-200 p-4">
            <div class="flex justify-between ">
              <h1 class="mb-2 text-xl">Article Details</h1>
              <div (click)="leftForm.set(false)" class="cursor-pointer">x</div>
            </div>
            <div class="flex flex-col gap-1 mt-2">
              <p>
                name:
                <span class="text-gray-400">{{ selectedArticle()!.name }}</span>
              </p>
              <p>
                price:
                <span class="text-gray-400">{{
                  selectedArticle()!.price
                }}</span>
              </p>
              <p>
                description:
                <span class="text-gray-400">{{
                  selectedArticle()!.description
                }}</span>
              </p>
              <p>
                creation date:
                <span class="text-gray-400">{{
                  selectedArticle()!.date_created
                }}</span>
              </p>
              <p>
                product:
                <span class="text-gray-400">{{
                  getProduct(selectedArticle()!.product)
                }}</span>
              </p>
              <p>
                active:
                <span class="text-gray-400">{{
                  selectedArticle()!.active
                }}</span>
              </p>
            </div>
          </div>
          }
        </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class ArticlesComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  toastr = inject(ToastrService);
  apiService = inject(ApiService);
  leftForm = signal(false);
  activeForm = signal<number>(1);
  fetchingArticles = signal(false);
  fetchingCat = signal(false);
  laodingArticle = signal(false);
  loadingCat = signal(false);
  editMode = signal(false);
  setActiveForm(num: number) {
    this.activeForm.set(num);
    this.leftForm.set(true);
  }

  categories = signal<Category[]>([]);
  articles = signal<Article[]>([]);
  products = signal<Product[]>([]);
  selectedArticle = signal<Article | null>(null);

  category: Category = {
    name: '',
  };

  article: Article = {
    name: '',
    description: '',
    active: false,
    price: 0,
    product: 0,
  };

  ngOnInit() {
    this.fetchingArticles.set(true);
    this.fetchingCat.set(true);

    this.subs.add(
      this.apiService.fetchArticles().subscribe({
        next: (articles) => {
          this.articles.set(articles);
          this.fetchingArticles.set(false);
        },
        error: (error) => {
          this.fetchingArticles.set(false);
          this.toastr.error('Server not connected!');
        },
      })
    );

    this.subs.add(
      this.apiService.fetchProducts().subscribe({
        next: (products) => {
          this.products.set(products);
        },
        error: (error) => {
          this.fetchingCat.set(false);
          this.toastr.error('Server not connected!');
        },
      })
    );
  }
  deleteArticle(id: number) {
    this.laodingArticle.set(true);
    this.subs.add(
      this.apiService.deleteArticle(id).subscribe({
        next: (res) => {
          this.articles.set(this.articles().filter((a) => a.id !== id));
          this.laodingArticle.set(false);
          this.toastr.success('Successful');
        },
        error: (error) => {
          this.laodingArticle.set(false);
          this.toastr.error('Failed!');
          console.log(error);
        },
      })
    );
  }

  saveArticle() {
    this.laodingArticle.set(true);
    console.log(this.article);

    if (!this.editMode()) {
      this.subs.add(
        this.apiService.addArticle(this.article).subscribe({
          next: (article) => {
            this.toastr.success('Successful');
            this.articles.set([...this.articles(), article]);
            this.resetArticle();
            this.laodingArticle.set(false);
          },
          error: (error) => {
            this.laodingArticle.set(false);
            this.toastr.error('Failed!');
            console.log(error);
          },
        })
      );
    } else {
      this.subs.add(
        this.apiService.editArticle(this.article).subscribe({
          next: (updatedArticle) => {
            this.toastr.success('Successful');

            const updatedList = this.articles().map((a) =>
              a.id === updatedArticle.id ? updatedArticle : a
            );
            this.articles.set(updatedList);
            this.resetArticle();
            this.laodingArticle.set(false);
          },
          error: (error) => {
            this.laodingArticle.set(false);
            this.toastr.error('Failed!');
            console.log(error);
          },
        })
      );
    }
  }

  resetArticle() {
    this.editMode.set(false);
    this.article = {
      id: 0,
      name: '',
      description: '',
      active: false,
      price: 0,
      product: 0,
    };
  }

  showProductArticle(article: Article) {
    this.selectedArticle.set(article);
    this.setActiveForm(3);
  }

  startEditArticle(article: Article) {
    this.editMode.set(true);
    this.article = article;
    this.leftForm.set(true);
    this.activeForm.set(1);
  }

  getProduct(id: number) {
    const prod = this.products().find((p) => p.id === id);
    return prod?.name;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
