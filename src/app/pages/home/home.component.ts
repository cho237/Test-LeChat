import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Article, Category } from '../../models';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-4 py-10 px-4 md:px-24 lg:px-64">
      <div>
        <div class="flex justify-between">
          <h2 class="text-2xl">Articles</h2>

          <div>
            <button
              (click)="toggleArticleForm()"
              class="bg-blue-500 text-white w-full  px-5 py-2 rounded-xl shadow-md hover:opacity-90 cursor-pointer"
            >
              @if(!laodingArticle()){
              {{ articleForm() ? 'Close' : 'Add' }}
              }@else{ 'loading...' }
            </button>
          </div>
        </div>

        @if(fetchingArticles() ){
        <p class="text-center p-4 italic">fetching...</p>
        } @if(!fetchingArticles() && articles().length < 1 && !articleForm()){
        <p class="text-center p-4 italic">Articles Empty</p>
        } @if(!fetchingArticles()){
        <div class="max-h-[30rem] overflow-auto py-4 px-2">
          <div class="flex gap-4 mt-4">
            <div class="w-full flex flex-col gap-2">
              @for (article of articles(); track article.id) {
              <div
                class="bg-slate-100 shadow-md rounded-xl  flex justify-between"
              >
                <div class="flex flex-col gap-2 p-6 ">
                  <div class="text-lg font-bold truncate">
                    {{ article.name }}
                  </div>
                  <div
                    class="text-sm max-w-xl truncate overflow-hidden whitespace-nowrap"
                  >
                    {{ article.description }}
                  </div>
                  <div class="text-sm font-bold">$ {{ article.price }}</div>
                  @if(article.active){
                  <div class="text-xs font-bold text-blue-700">Active</div>
                  } @else{
                  <div class="text-xs font-bold text-red-600">Desactive</div>
                  }
                </div>
                <div class="flex flex-col justify-between items-end ">
                  <div class="flex gap-2 p-2">
                    <p class="text-xs underline  cursor-pointer">View</p>
                    <p
                      (click)="startEditArticle(article)"
                      class="text-xs underline text-blue-600 cursor-pointer"
                    >
                      Edit
                    </p>
                    <div
                      class="text-xs underline text-red-600 cursor-pointer"
                      (click)="deleteArticle(article.id!)"
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
            @if(articleForm()){
            <div class="w-[40rem]">
              <form #articleForm="ngForm" class="max-w-sm mx-auto">
                <h1 class="mb-2 text-xl">
                  @if(editMode()){ Edit Article }@else { Add Article }
                </h1>
                <div class="mb-2">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    [(ngModel)]="article.name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div class="mb-2">
                  <input
                    type="text"
                    id="desription"
                    name="description"
                    [(ngModel)]="article.description"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div class="mb-2">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    [(ngModel)]="article.price"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div class="mb-2">
                  <label
                    for="countries"
                    class="block mb-1 text-xs font-medium text-gray-900"
                    >Active</label
                  >
                  <select
                    id="active"
                    name="active"
                    [(ngModel)]="article.active"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label
                    for="cat"
                    class="block mb-1 text-xs font-medium text-gray-900"
                    >Select category</label
                  >
                  <select
                    id="cat"
                    name="cat"
                    [(ngModel)]="article.product"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    @for (category of categories(); track category.id) {
                    <option value="{{ category.id }}">
                      {{ category.name }}
                    </option>
                    }
                  </select>
                </div>

                <div class="flex gap-4 mt-8">
                  <button
                    (click)="addArticle()"
                    [disabled]="!articleForm.valid || laodingArticle()"
                    class="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center cursor-pointer"
                  >
                    Sauvegarde
                  </button>

                  <button
                    (click)="resetArticle()"
                    class="text-white bg-red-7400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center cursor-pointer"
                  >
                    Efface
                  </button>
                </div>
              </form>
            </div>
            }
          </div>
        </div>
        }

        <div>
          <div class="flex justify-between mt-18">
            <h2 class="text-2xl">Categories</h2>

            <div>
              <button
                (click)="toggleCatForm()"
                class="bg-green-500 text-white w-full  px-5 py-2 rounded-xl shadow-md hover:opacity-90 cursor-pointer"
              >
                @if(!loadingCat()){
                {{ catForm() ? 'Close' : 'Add' }}
                }@else { 'loading..' }
              </button>
            </div>
          </div>

          @if(fetchingCat() ){
          <p class="text-center p-4 italic">fetching...</p>
          } @if(!fetchingCat() && categories().length < 1 && !catForm()){
          <p class="text-center p-4 italic">Categories Empty</p>
          }

          <div class="flex gap-4 py-6">
            @if(!fetchingCat()){
            <div class="w-full">
              <div class="flex flex-wrap gap-4  ">
                @for (category of categories(); track category.id) {
                <div class="flex gap-2 border rounded-xl bg-slate-100">
                  <div class=" py-3 px-2">
                    {{ category.name }}
                  </div>
                  <div
                    (click)="deleteCat(category.id!)"
                    class="text-xs cursor-pointer p-1"
                  >
                    x
                  </div>
                </div>
                }
              </div>
            </div>
            } @if(catForm()){
            <div class="w-[40rem]">
              <form #catForm="ngForm" class="max-w-sm mx-auto">
                <h1 class="mb-2 text-xl">Add Category</h1>
                <div class="mb-2">
                  <input
                    type="text"
                    id="catName"
                    [(ngModel)]="category.name"
                    name="catName"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter categry name"
                    required
                  />
                </div>

                <div class="flex gap-4 mt-4">
                  <button
                    (click)="addCat()"
                    [disabled]="!catForm.valid || loadingCat()"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  toastr = inject(ToastrService);
  apiService = inject(ApiService);
  articleForm = signal(false);
  catForm = signal(false);
  fetchingArticles = signal(false);
  fetchingCat = signal(false);
  editMode = signal(false);

  laodingArticle = signal(false);
  loadingCat = signal(false);

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
      this.apiService.fetchCategories().subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.fetchingCat.set(false);
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

  deleteCat(id: number) {
    this.loadingCat.set(true);
    this.subs.add(
      this.apiService.deleteCategory(id).subscribe({
        next: (res) => {
          this.categories.set(this.categories().filter((c) => c.id !== id));
          this.loadingCat.set(false);
          this.toastr.success('Successful');
        },
        error: (error) => {
          this.loadingCat.set(false);
          this.toastr.error('Failed!');
          console.log(error);
        },
      })
    );
  }

  addCat() {
    this.loadingCat.set(true);
    this.subs.add(
      this.apiService.addCategory(this.category).subscribe({
        next: (category) => {
          this.toastr.success('Successful');
          this.categories.set([...this.categories(), category]);
          this.category.name = '';
          this.loadingCat.set(false);
        },
        error: (error) => {
          this.loadingCat.set(false);
          this.toastr.error('Failed!');
          console.log(error);
        },
      })
    );
  }

  addArticle() {
    this.laodingArticle.set(true);

    if (this.editMode()) {
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

  startEditArticle(article: Article) {
    this.editMode.set(true);
    this.article = article;
    this.articleForm.set(true);
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

  toggleArticleForm() {
    this.articleForm.set(!this.articleForm());
  }

  toggleCatForm() {
    this.catForm.set(!this.catForm());
  }

  categories = signal<Category[]>([]);
  articles = signal<Article[]>([
    {
      name: 'first',
      description: 'the first',
      active: false,
      price: 0,
      product: 15,
    },
  ]);

  shadowColor: string = 'rgba(255, 0, 0, 0.5)';

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
