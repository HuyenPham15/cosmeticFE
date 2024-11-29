import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Shift } from '../ts/Shift';

@Injectable({
  providedIn: 'root'
})
export class GhnService {

  private GHN_API_URL_PROVINCE = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province';
  private GHN_API_URL_DISTRICT = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district';
  private GHN_API_URL_WARD = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id';
  private GHN_API_URL_SHIPFEE = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
  private GHN_API_URL_SERVICE = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services';
  private GHN_API_URL_LEADTIME = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime';
  private apiUrl = 'http://localhost:8080/api/ghn';

  private token = '18da3387-9f92-11ef-8e53-0a00184fe694'; // Thay bằng token thực tế của bạn
  private shopid = '195275'
  constructor(private http: HttpClient) { }

  private createHeaders() {
    return {
      headers: new HttpHeaders({
        'Token': this.token,
        'ShopID': this.shopid
      })

    };
  }

  getProvinces(): Observable<any> {
    return this.http.get<any>(this.GHN_API_URL_PROVINCE, this.createHeaders());
  }

  getDistricts(provinceId: number): Observable<any> {
    const body = { province_id: provinceId };
    return this.http.post<any>(this.GHN_API_URL_DISTRICT, body, this.createHeaders());
  }

  getWards(districtId: number): Observable<any> {
    const body = { district_id: districtId };
    return this.http.post<any>(this.GHN_API_URL_WARD, body, this.createHeaders());
  }

  getShippingFee(requestData: any): Observable<any> {
    return this.http.post<any>(this.GHN_API_URL_SHIPFEE, requestData, this.createHeaders());
  }
  getAvailableServices(requestData: any): Observable<any> {
    return this.http.post<any>(this.GHN_API_URL_SERVICE, requestData, this.createHeaders());
  }
  calculateLeadTime(requestData: any): Observable<any> {
    return this.http.post<any>(this.GHN_API_URL_LEADTIME, requestData, this.createHeaders());
  }
  // createOrder(orderData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/create-order`, orderData);
  // }
  getShifts(date: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.apiUrl}/shifts?date=${date}`);
  }
}
