import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article, Category, Product } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  fetchCategories() {
    return this.http.get<Category[]>(`${this.apiUrl}/category/`);
  }

  fetchProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}/product/`);
  }

  fetchArticles() {
    return this.http.get<Article[]>(`${this.apiUrl}/article/`);
  }

  deleteArticle(id: number) {
    return this.http.delete(`${this.apiUrl}/article/${id}`);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/product/${id}`);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/category/${id}`);
  }

  addCategory(category: Category) {
    return this.http.post<Category>(`${this.apiUrl}/category/`, category);
  }

  addArticle(article: Article) {
    return this.http.post<Article>(`${this.apiUrl}/article/`, article);
  }

  addProduct(product: Product) {
    return this.http.post<Product>(`${this.apiUrl}/product/`, product);
  }

  editArticle(article: Article) {
    return this.http.put<Article>(
      `${this.apiUrl}/article/${article.id}`,
      article
    );
  }

  editProduct(product: Product) {
    return this.http.put<Product>(
      `${this.apiUrl}/product/${product.id}`,
      product
    );
  }
}
