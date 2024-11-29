import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { Subcategory } from './subcategory';  // Sửa tên lớp cho đúng




@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
private baseURL="http://localhost:8080/api/ad/subcategory";
  constructor(private httpClient: HttpClient) { }

  getSubcategory(): Observable<Subcategory[]>{
    return this.httpClient.get<Subcategory[]>(`${this.baseURL}`);
  } 
  private Surl="http://localhost:8080/api/user/subcategory/products";
getProductBySubcategory(subcategoryID: number): Observable<any[]>{
  return this.httpClient.get<any[]>(`${this.Surl}/${subcategoryID}`)
}
private Suburl="http://localhost:8080/api/user/subcategory";
getSubcategoryByID(SubcategoryID: number): Observable<Subcategory> {
  return this.httpClient.get<Subcategory>(`${this.Suburl}/${SubcategoryID}`);
}


}
