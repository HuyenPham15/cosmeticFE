import { CartItem } from "./cartItem";

  export interface Cart {
    items: CartItem[];
    totalItems: number; 
    totalPrice: number; 
  }
  export interface ProductSize {
    id: string; 
    variant: string; 
    price: number; 
  }