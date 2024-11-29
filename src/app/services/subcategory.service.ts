import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subcategory } from '../ts/Subcategory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  private baseURL = "http://localhost:8080/api/ad/subcategory";
  constructor(private httpClient: HttpClient) { }

  getSubcategory(): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>(`${this.baseURL}`);
  }
  private Surl = "http://localhost:8080/product/subcategory/products";
  getProductBySubcategory(subcategoryID: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.Surl}/${subcategoryID}`)
  }
  private Suburl = "http://localhost:8080/product/subcategory";
  getSubcategoryByID(SubcategoryID: number): Observable<Subcategory> {
    return this.httpClient.get<Subcategory>(`${this.Suburl}/${SubcategoryID}`);
  }
}
