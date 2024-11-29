import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../ts/cartItem';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { NavbarClientComponent } from "../navbar-client/navbar-client.component";
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarClientComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = []; // Mảng để lưu trữ các sản phẩm trong giỏ hàng
  selectAll: boolean = false; // Biến để theo dõi trạng thái chọn tất cả
  totalSelectedPrice: number = 0; // Biến để lưu tổng tiền
  itemCounts: { [key: string]: number } = {}; // Đối tượng lưu số lượng theo productId
  selectedItems: CartItem[] = [];
  constructor(private cartService: CartService, private router: Router, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loadCartItems();

  }

  loadCartItems(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userIdString = localStorage.getItem('userID');
      const userId = userIdString ? Number(userIdString) : null;

      if (userId) {
        this.cartService.getCartItems(userId).subscribe(
          (items: CartItem[]) => {
            this.cartItems = items;
            console.log('Cart items:', this.cartItems);
            this.calculateTotal();
            this.calculateTotalItems(); // Tính tổng số lượng sản phẩm
          },
          error => {
            console.error('Error fetching cart items', error);
            alert('Có lỗi xảy ra khi tải giỏ hàng.');
          }
        );
      } else {
        alert('Vui lòng đăng nhập để xem giỏ hàng.');
        this.router.navigate(['/login']);
      }
    }
  }

  updateTotalPrice(item: CartItem): void {
    if (item.quantity <= 0) {
      this.removeItem(item);
    } else {
      item.totalPrice = item.quantity * item.price;
      this.calculateTotal();
      this.calculateTotalItems();

    }
  }
  removeItem(item: CartItem): void {
    if (item.cartId === undefined) {
      console.error('Item ID is undefined');
      alert('Có lỗi xảy ra khi xóa sản phẩm. ID không hợp lệ.');
      return;
    }

    this.cartService.removeCartItem(item.cartId).subscribe(
      () => {
        this.loadCartItems();
        alert('Sản phẩm sẽ được xóa khỏi giỏ hàng.');
      },
      error => {
        console.error('Error removing item', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm.');
      }
    );
  }
  calculateTotal(): void {
    this.totalSelectedPrice = this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.totalPrice || 0), 0);
  }

  calculateTotalItems(): void {
    this.itemCounts = {};
    this.cartItems.forEach(item => {
      if (item.quantity > 0) {
        this.itemCounts[item.productId] = (this.itemCounts[item.productId] || 0) + item.quantity;
      }
    });
  }

  toggleSelectAll(): void {
    this.cartItems.forEach(item => {
      item.selected = this.selectAll;
    });
    this.calculateTotal();
    this.calculateTotalItems();
  }
  proceedToCheckout() {
    const userIdString = localStorage.getItem('userID');

    if (!userIdString) {
      localStorage.setItem('redirectAfterLogin', '/check-carts');
      alert('Vui lòng đăng nhập để tiếp tục thanh toán.');
      this.router.navigate(['/login']);
      return;
    }

    const selectedItems = this.cartItems.filter(item => item.selected);
    if (selectedItems.length > 0) {
      console.log('Proceeding to checkout with items:', selectedItems);
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
      this.router.navigate(['/check-carts'], { state: { selectedItems: selectedItems } });
    } else {
      alert('Vui lòng chọn một sản phẩm để thanh toán.');
    }
  }

}