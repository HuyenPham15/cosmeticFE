import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../ts/product';
import { Brand } from '../ts/Brand';
import { Category } from '../ts/Category';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseURL = "http://localhost:8080/api/ad/admin";
  private apiUrl = "http://localhost:8080/home/product";
  private api = "http://localhost:8080/products"

  constructor(private httpClient: HttpClient) { }

  createProduct(productDTO: any): Observable<any> {

    return this.httpClient.post(this.baseURL, productDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    });
  }

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/getAll`);
  }
  getProductById(productId: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/${productId}`);
  }
  // Phương thức để lấy danh sách thương hiệu nổi bật
  getFeaturedBrands(): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(`${this.apiUrl}/brand`);
  }
  getProductsByCategory(categoryID: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/category/${categoryID}`);
  }
  getCategory(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.apiUrl}/category`);
  }
}
