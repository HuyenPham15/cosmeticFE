import { DiscountProduct } from "./DiscounProduct";
import { ProductSize } from "./ProductSize";

// src/app/models/product.model.ts
export interface Product {
  productId: string;
  name: string;
  image: string;
  description: string;
  sizes: Array<{
    variant: string;
    price: number;
    productSizeID: number;
    weight: string;
    discountPrice: number
  }>;
  productName: string;
  images: string | string[];
  specifications: string;
  ingredients: string;
  benefits: string;
  usage: string;
  review: string;
  skinID: string;
  skinName: string;
  brandID: string;
  brandName: string;
  categoryName: string;
  subcategoryName: string;
  variant: string;
  price: number;
  discountPrice: number;
  quantity: number;
  subcategoryID: string;
  productSizeID: number;
  productSizes: ProductSize[];
  firstImage?: string;
  discountProduct: DiscountProduct;
}