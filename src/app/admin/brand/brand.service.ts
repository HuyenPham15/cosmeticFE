import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from './brand';  // Đảm bảo rằng bạn đã import đúng class Brand

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private baseURL = "http://localhost:8080/api/ad/brand";  // URL cơ bản của API

  constructor(private httpClient: HttpClient) { }

  // Phương thức để lấy tất cả các brand từ API
  getBrand(): Observable<Brand[]>{
    return this.httpClient.get<Brand[]>(`${this.baseURL}`);
  } 
}
