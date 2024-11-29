import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../ts/Category';
import { Observable } from 'rxjs';
import { Product } from '../ts/product';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseURL = "http://localhost:8080/product";
  constructor(private httpClient: HttpClient) { }

  getCategory(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.baseURL}/category`);
  }
  getSubcategoriesByCategory(categoryId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseURL}/category/${categoryId}/subcategory`);
  }
  getCategoryByID(categoryID: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.baseURL}/${categoryID}`);
  }
  getProductsByCategory(categoryID: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/category/${categoryID}`);
  }
}
