import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Article, Category, Product } from '../../models';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  template: `
    <div class=" px-16 md:px-24 lg:px-64 xl:px-90 py-6 ">
      <div class="flex gap-4">
        <div class="w-full">
          <div class="mb-8">
            <h1>Products</h1>
            <div class="h-1 w-full bg-orange-400 "></div>
          </div>

          @if(fetchingProducts()){
          <p class="text-center italic ">loading...</p>
          } @if(!fetchingProducts() && products().length < 1){
          <p class="text-center italic ">No article yet</p>
          } @if(!fetchingArticles() && products().length > 0){
          <div class="max-h-[40rem] overflow-auto">
            @for (product of products(); track product.id) {
            <div class="border-t border-b border-gray-300 py-2">
              <div (click)="showProductDetails(product)" class="cursor-pointer">
                <p class="text-md font-bold mb-2">{{ product.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ product.description }}
                </p>
                @if(product.active){
                <p class="text-sm text-green-500 mb-2">Active</p>
                } @else {
                <p class="text-sm text-red-500 mb-2">Inactive</p>
                }

                <div class="flex justify-between">
                  <p class="text-xs text-gray-500 font-bold">
                    [ {{ getCat(product.category) }} ]
                  </p>
                </div>
              </div>
              <div class="flex justify-end gap-2 text-xs mt-2">
                <p
                  (click)="startEditProduct(product)"
                  class="cursor-pointer underline "
                >
                  Edit
                </p>
                <p
                  (click)="deleteProduct(product.id!)"
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
              Add Product
            </p>
          </div>
        </div>

        <!-- add article -->
        @if(leftForm()){
        <div class="w-full px-8 py-4 ">
          @if(activeForm() === 1){
          <form
            #productForm="ngForm"
            class="border border-gray-200 p-4"
            action=""
          >
            <div class="flex justify-between ">
              <h1 class="mb-2 text-xl">
                @if(editMode()){ Edit Product }@else{ Add Product }
              </h1>
              <div (click)="leftForm.set(false)" class="cursor-pointer">x</div>
            </div>

            <div class="relative z-0 w-full mb-2 group">
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="product.name"
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
                [(ngModel)]="product.description"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Please Enter description"
                required
              />
            </div>

            <div class="mt-2">
              <label for="" class="text-xs font-bold">Select Active </label>
              <select
                id="active"
                name="active"
                [(ngModel)]="product.active"
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
                [(ngModel)]="product.category"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
              >
                @for (cat of categories(); track cat.id) {

                <option value="{{ cat.id }}">
                  {{ cat.name }}
                </option>
                }
              </select>
            </div>

            <div class="flex gap-4 mt-8">
              <button
                (click)="saveProduct()"
                [disabled]="!productForm.valid || loadingProduct()"
                class="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full px-5 py-2.5 text-center cursor-pointer"
              >
                Save
              </button>

              <button
                (click)="resetProduct()"
                class="text-white bg-red-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm w-full px-5 py-2.5 text-center cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
          } @if(activeForm() === 2){
          <form #catForm="ngForm" class="border border-gray-200 p-4">
            <div class="flex justify-between ">
              <h1 class="mb-2 text-xl">Add Category</h1>
              <div (click)="leftForm.set(false)" class="cursor-pointer">x</div>
            </div>

            <div class="relative z-0 w-full mb-2 group">
              <input
                type="email"
                name="catName"
                [(ngModel)]="category.name"
                id="catName"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Please Enter name"
                required
              />
            </div>

            <div class="flex gap-4 mt-8">
              <button
                (click)="addCat()"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm w-full px-5 py-2.5 text-center cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
          } @if(activeForm() === 3){
          <div class="border border-gray-200 p-4">
            <div class="flex justify-between ">
              <h1 class="mb-2 text-xl">Product Details</h1>
              <div (click)="leftForm.set(false)" class="cursor-pointer">x</div>
            </div>
            <div class="flex flex-col gap-1 mt-2">
              <p>
                name:
                <span class="text-gray-400">{{ selectedProduct()?.name }}</span>
              </p>
              <p>
                description:
                <span class="text-gray-400">{{
                  selectedProduct()!.description
                }}</span>
              </p>
              <p>
                creation date:
                <span class="text-gray-400">{{
                  selectedProduct()!.date_created
                }}</span>
              </p>
              <p>
                category:
                <span class="text-gray-400">{{
                  getCat(selectedProduct()!.category)
                }}</span>
              </p>
              <p>
                active:
                <span class="text-gray-400">{{
                  selectedProduct()!.active
                }}</span>
              </p>
            </div>
          </div>
          }
        </div>
        }
      </div>
      <div class="flex gap-4 mt-20">
        <div class="w-full">
          <div class="mb-4">
            <h1>Categories</h1>
            <div class="h-1 w-full bg-blue-400 "></div>
          </div>

          @if(fetchingCat()){
          <p class="text-center italic ">loading...</p>
          } @if(!fetchingCat() && categories().length < 1){
          <p class="text-center italic ">No categories yet</p>
          } @if(!fetchingCat() && categories().length > 0){
          <div class="flex flex-col gap-2 mt-2">
            @for (category of categories(); track category.id) {
            <div class="border py-1 px-2 w-full">
              <div class="flex justify-between gap-4">
                <p>{{ category.name }}</p>

                <div class="flex justify-end gap-2 text-xs mt-2">
                  <p
                    (click)="editCat(category)"
                    class="cursor-pointer underline "
                  >
                    Edit
                  </p>
                  <p
                    (click)="deleteCat(category.id!)"
                    class="cursor-pointer underline text-red-500"
                  >
                    Delete
                  </p>
                </div>
              </div>
            </div>
            }
          </div>
          }
          <div class="mt-2">
            <p
              (click)="newCat()"
              class="cursor-pointer underline text-xs text-blue-500"
            >
              Add Category
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductsComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  toastr = inject(ToastrService);
  apiService = inject(ApiService);
  leftForm = signal(false);
  activeForm = signal<number>(1);
  fetchingArticles = signal(false);
  fetchingCat = signal(false);
  fetchingProducts = signal(false);
  loadingProduct = signal(false);
  loadingCat = signal(false);
  editMode = signal(false);
  selectedProduct = signal<Product | null>(null);
  setActiveForm(num: number) {
    this.activeForm.set(num);
    this.leftForm.set(true);
  }
  editingCat = signal(false);
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);

  category: Category = {
    name: '',
  };

  product: Product = {
    name: '',
    description: '',
    active: false,
    category: 0,
  };

  ngOnInit() {
    this.fetchingCat.set(true);
    this.fetchingProducts.set(true);

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

    this.subs.add(
      this.apiService.fetchProducts().subscribe({
        next: (products) => {
          this.products.set(products);
          this.fetchingProducts.set(false);
        },
        error: (error) => {
          this.fetchingProducts.set(false);
          this.toastr.error('Server not connected!');
        },
      })
    );
  }

  showProductDetails(product: Product) {
    this.selectedProduct.set(product);
    this.setActiveForm(3);
  }

  deleteProduct(id: number) {
    this.loadingProduct.set(true);
    this.subs.add(
      this.apiService.deleteProduct(id).subscribe({
        next: (res) => {
          this.products.set(this.products().filter((a) => a.id !== id));
          this.loadingProduct.set(false);
          this.toastr.success('Successful');
        },
        error: (error) => {
          this.loadingProduct.set(false);
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
    if (this.editingCat()) {
      this.subs.add(
        this.apiService.editCategory(this.category).subscribe({
          next: (updatedCat) => {
            this.toastr.success('Successful');

            const updatedList = this.categories().map((a) =>
              a.id === updatedCat.id ? updatedCat : a
            );
            this.categories.set(updatedList);
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
    } else {
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
  }

  editCat(cat: Category) {
    this.setActiveForm(2);
    this.category = cat;
    this.editingCat.set(true);
  }

  newCat() {
    this.category.name = '';
    this.setActiveForm(2);
    this.editingCat.set(false);
  }

  saveProduct() {
    this.loadingProduct.set(true);
    console.log(this.product);

    if (!this.editMode()) {
      this.subs.add(
        this.apiService.addProduct(this.product).subscribe({
          next: (article) => {
            this.toastr.success('Successful');
            this.products.set([...this.products(), this.product]);
            this.resetProduct();
            this.loadingProduct.set(false);
          },
          error: (error) => {
            this.loadingProduct.set(false);
            this.toastr.error('Failed!');
            console.log(error);
          },
        })
      );
    } else {
      this.subs.add(
        this.apiService.editProduct(this.product).subscribe({
          next: (updatedProduct) => {
            this.toastr.success('Successful');

            const updatedList = this.products().map((a) =>
              a.id === updatedProduct.id ? updatedProduct : a
            );
            this.products.set(updatedList);
            this.resetProduct();
            this.loadingProduct.set(false);
          },
          error: (error) => {
            this.loadingProduct.set(false);
            this.toastr.error('Failed!');
            console.log(error);
          },
        })
      );
    }
  }

  resetProduct() {
    this.editMode.set(false);
    this.product = {
      id: 0,
      name: '',
      description: '',
      active: false,
      category: 0,
    };
  }

  startEditProduct(product: Product) {
    this.editMode.set(true);
    this.product = product;
    this.leftForm.set(true);
    this.activeForm.set(1);
  }

  getCat(id: number) {
    const prod = this.categories().find((p) => p.id === id);
    return prod?.name;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
