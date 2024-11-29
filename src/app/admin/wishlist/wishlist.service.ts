import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Wishlist } from './wishlist';
import {  Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private httpClient: HttpClient) { }
   private wishlisturl="http://localhost:8080/api/user/wishlist"
   addProducttoWishlist(userID: string, productID: string): Observable<boolean> {
 return this.httpClient.post<boolean>(`${this.wishlisturl}/add/${userID}/${productID}`, {});
  }
  removeProductFromWishlist(userID: string, productID: string): Observable<any> {
    return this.httpClient.delete(`${this.wishlisturl}/remove/${userID}/${productID}`);
  }

  
  getWishlist(userID: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.wishlisturl}/${userID}`);
  }
}
