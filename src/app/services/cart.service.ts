import { Injectable } from '@angular/core';
import { CartItem } from '../ts/cartItem';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../ts/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/cart'; // Adjust the URL as necessary
  selectedItems: CartItem[] = [];

  constructor(private http: HttpClient) { }

  addToCart(cartItem: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/add`, cartItem);
  }
  getCartItems(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/items?userId=${userId}`);
  }
  removeCartItem(id: number): Observable<CartItem[]> {
    return this.http.delete<CartItem[]>(`${this.apiUrl}/remove/${id}`);
  }
  getUniqueProductCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unique-count/${userId}`);
  }
  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }
}
