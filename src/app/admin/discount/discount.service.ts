import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discount } from './discount';  // Import model Discount

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private baseURL = "http://localhost:8080/api/ad/discount";  // Cập nhật đường dẫn cho discount API

  constructor(private httpClient: HttpClient) { }

  // Hiển thị danh sách tất cả các discount
  getAllDiscounts(): Observable<Discount[]> {
    console.log('Fetching discounts from API...');
    return this.httpClient.get<Discount[]>(`${this.baseURL}`);
  }


  // Thêm mới discount
  createDiscount(discount: Discount): Observable<Discount> {
    return this.httpClient.post<Discount>(`${this.baseURL}`, discount);
  }

  // Cập nhật discount theo ID
  updateDiscount(discountId: string, discount: Discount): Observable<Discount> {
    return this.httpClient.put<Discount>(`${this.baseURL}/${discountId}`, discount);
  }

  // Xóa discount theo ID
  deleteDiscount(discountId: string): Observable<any> {
    return this.httpClient.delete(`${this.baseURL}/${discountId}`, { responseType: 'text' });
  }

  // Tìm discount theo ID
  getDiscountById(discountId: string): Observable<Discount> {
    return this.httpClient.get<Discount>(`${this.baseURL}/${discountId}`);
  }
  getDiscounts(): Observable<any> {
    return this.httpClient.get('http://localhost:8080/valid');
  }
}
