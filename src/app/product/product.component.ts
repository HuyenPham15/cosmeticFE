import { Component, OnInit } from '@angular/core';
import { Product } from '../ts/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  avatarPreview: string | ArrayBuffer | null = null;
  selectedProduct!: Product; // Variable to hold the selected product for the modal
  selectedSize: any;
  quantity: number = 1;

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
    });
    console.log("Size", this.selectedSize)
  }
  productDetail(productId: string) {
    this.productService.getProductById(productId).subscribe(
      data => {
        this.selectedProduct = data;
        console.log("Product ID:", this.selectedProduct.productId);
        console.log("Product Sizes:", this.selectedProduct.sizes); // Kiểm tra kích thước
      },
      error => console.log(error)
    );
  }
  onSizeSelect(size: any) {
    this.selectedSize = size; // Đảm bảo rằng kích thước được chọn
    console.log('Selected Size:', this.selectedSize); // Kiểm tra giá trị
  }

  incrementQuantity() {
    if (this.quantity < 19) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }

  }

  addToCart() {
    if (!this.selectedProduct || !this.selectedSize) {
      console.error('Please select a product and size before adding to cart.');
      return;
    }

    const cartItem = {
      cartItemId: 0,
      productId: this.selectedProduct.productId,
      productSizeId: this.selectedSize.productSizeID, // Đảm bảo rằng ID này được thiết lập
      quantity: this.quantity,
      price: this.selectedSize.price,
      totalPrice: this.selectedSize.price * this.quantity,
      productName: this.selectedProduct.name,
      productImage: this.selectedProduct.image.split(',')[0].trim(),
      variant: this.selectedSize.variant,
      weight: this.selectedSize.weight,

    };

    console.log('Adding to cart:', cartItem);
    this.cartService.addToCart(cartItem).subscribe(
      response => {
        console.log('Item added to cart:', response);
        alert("Đã thêm vào giỏ hàng")
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        this.router.navigate(['/cart']);
      },
      error => {
        console.error('Error adding item to cart:', error);
      }
    );
  }
}
