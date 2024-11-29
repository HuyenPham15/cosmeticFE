import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { Productsize } from './productsize';


@Injectable({
  providedIn: 'root'
})
export class ProductsizeService {
  private baseURL="http://localhost:8080/api/ad/product_size";
  constructor(private httpClient: HttpClient) { }

  getProductsize(): Observable<Productsize[]>{
    return this.httpClient.get<Productsize[]>(`${this.baseURL}`);
  } 

}
