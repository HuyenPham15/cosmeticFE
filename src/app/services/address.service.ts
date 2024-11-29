import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Address } from '../ts/Address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private baseURL = 'http://localhost:8080/api/addresses';

  constructor(private http: HttpClient) { }
  createAddress(address: any): Observable<any> {
    return this.http.post<any>(this.baseURL, address);
  }
  getUserAddress(userId: number): Observable<Address> {
    return this.http.get<Address>(`${this.baseURL}/user/${userId}`);
  }

}
