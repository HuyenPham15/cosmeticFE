// cart-item.model.ts
export interface CartItem {
  cartId?: number;
  userId?: number;
  productId: string;
  productSizeId: number;
  price: number;
  quantity: number;
  totalPrice: number;
  productName: string;
  productImage: string;
  variant: string;
  weight: string;
  insuranceSelected?: boolean;
  discountPrice?: number;
}