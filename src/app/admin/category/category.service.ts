import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../category/category';




@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseURL = "http://localhost:8080/api/ad/category";
  constructor(private httpClient: HttpClient) { }

  getCategory(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.baseURL}`);
  }



  private url = "http://localhost:8080/api/user/category";
  getSubcategoriesByCategory(categoryId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}/${categoryId}/subcategory`);
  }
  private urlid = "http://localhost:8080/api/user/categoryId";
  getCategoryByID(categoryID: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.urlid}/${categoryID}`);
  }
}
