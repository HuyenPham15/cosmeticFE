import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyRevenueDTO, MonthlyRevenueDTO } from './model';

@Injectable({
  providedIn: 'root',  // Dùng ở phạm vi toàn app
})
export class StatisticsService {
  private baseUrl = 'http://localhost:8080/api/test/admin/statistics';  // Địa chỉ backend

  constructor(private http: HttpClient) {}

  // Lấy tổng doanh thu
  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-revenue`);
  }

  // Lấy số lượng đơn hàng hoàn thành
  getCompletedOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/completed-orders`);
  }

  // Lấy số lượng đơn hàng đang xử lý
  getPendingOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/pending-orders`);
  }

  // Lấy số lượng đơn hàng đang giao hàng
  getShippingOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/shipping-orders`);
  }

  // Lấy số lượng đơn hàng đã hủy
  getCanceledOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/canceled-orders`);
  }

  // Lấy hàng tồn kho
  getTotalRemainingStock(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/remaining-stock`);
  }

  // Lấy doanh thu hàng ngày
  getDailyRevenues(): Observable<DailyRevenueDTO[]> {
    return this.http.get<DailyRevenueDTO[]>(`${this.baseUrl}/daily-revenues`);
  }

  // Lấy doanh thu hàng tháng
  getMonthlyRevenues(): Observable<MonthlyRevenueDTO[]> {
    return this.http.get<MonthlyRevenueDTO[]>(`${this.baseUrl}/monthly-revenues`);
  }

  // Lấy top 5 sản phẩm bán chạy nhất
  getTopProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/top-products`);
  }
}
