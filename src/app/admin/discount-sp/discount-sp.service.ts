import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discount_sp } from './discount-sp';

@Injectable({
  providedIn: 'root'
})
export class DiscountSpService {
  private baseURL = "http://localhost:8080/api/ad";

  constructor(private httpClient: HttpClient) { }

  // Lấy tất cả discount_sp
  getDiscount_sp(): Observable<Discount_sp[]> {
    return this.httpClient.get<Discount_sp[]>(`${this.baseURL}/discount_sp/getAllDiscount`);
  }

  // Lấy thông tin discount theo ID
  getDiscountById(id: string): Observable<Discount_sp> {
    return this.httpClient.get<Discount_sp>(`${this.baseURL}/discount_sp/${id}`);
  }

  // Tạo mới discount_sp
  createDiscount_sp(discount_sp: Discount_sp): Observable<Discount_sp> {
    return this.httpClient.post<Discount_sp>(`${this.baseURL}/discount_sp`, discount_sp);
  }

  // Cập nhật discount_sp theo ID
  updateDiscount_sp(id: string, discount_sp: Discount_sp): Observable<Discount_sp> {
    return this.httpClient.put<Discount_sp>(`${this.baseURL}/discount_sp/${id}`, discount_sp);
  }

  // Xóa mềm discount_sp theo ID
  deleteDiscount_sp(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/discount_sp/${id}`);
  }
}
