import { Component, OnInit } from '@angular/core';
import { Product } from '../../ts/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NavbarClientComponent } from "../../navbar-client/navbar-client.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarClientComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  product: Product | null = null; // Biến để lưu thông tin sản phẩm
  error: string | null = null; // Biến để lưu thông tin lỗi
  quantity: number = 1; // Biến để lưu số lượng sản phẩm được chọn
  currentImage: string | null = null; // Biến để lưu hình ảnh hiện tại
  images: string[] = [];  // Danh sách hình ảnh sau khi xử lý
  comments: any[] = [];  // Thêm biến lưu trữ danh sách nhận xét
  selectedProduct!: Product;
  selectedSize: any;
  productId!: string;
  productName!: string;


  constructor(
    private route: ActivatedRoute,  // Để lấy thông tin từ URL
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    // Lấy productId từ URL
    this.productId = this.route.snapshot.paramMap.get('productId') || '';  // 'id' là tên tham số trong URL

    // Kiểm tra xem productID có hợp lệ không
    if (this.productId) {
      this.productDetail(this.productId);
    } else {
      this.error = 'Không tìm thấy thông tin sản phẩm.';
      console.error('Product ID is missing or undefined');
    }
  }

  productDetail(productId: string) {
    this.productService.getProductById(productId).subscribe(
      data => {
        console.log('Product Data:', data);  // Kiểm tra dữ liệu từ API
        this.selectedProduct = data;
        this.processImages();
        this.setImage();
      },
      error => {
        this.error = 'Không thể tải thông tin sản phẩm';
        console.log(error);
      }
    );
  }
  processImages(): void {
    if (typeof this.selectedProduct?.images === 'string') {
      this.images = this.selectedProduct.images.split(',')
        .map(imageName => imageName.trim())
        .filter(imageName => imageName)
        .map(imageName => this.formatImagePath(imageName));
    } else if (Array.isArray(this.selectedProduct?.images)) {
      this.images = this.selectedProduct.images.flatMap(imageName =>
        typeof imageName === 'string' ? imageName.split(',') : []
      ).map(imageName => imageName.trim())
        .filter(imageName => imageName)
        .map(imageName => this.formatImagePath(imageName));
    } else {
      this.images = [];
    }
  }

  private formatImagePath(imageName: string): string {
    if (imageName.startsWith('assets/upload/')) {
      return imageName;
    }
    return `assets/upload/${imageName}`;
  }

  setImage(): void {
    if (this.images && this.images.length > 0) {
      this.currentImage = this.images[0];
    }
  }

  changeImage(image: string | null): void {
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
      mainImage.classList.remove('fade-in-active');
      setTimeout(() => {
        this.currentImage = image || 'assets/upload/default-image.jpg';
        mainImage.classList.add('fade-in-active');
      }, 100);
    }
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
  onSizeSelect(size: any): void {
    if (!size) {
      console.warn("No size selected.");
      return;
    }

    this.selectedSize = size;
    console.log('Selected Size:', this.selectedSize);
    const currentPrice = this.getCurrentPrice();
    console.log('Current Price:', currentPrice);
  }
  getCurrentPrice(): number {
    // Kiểm tra xem `selectedSize` có giá giảm hợp lệ không
    if (this.selectedSize?.discountPrice && this.selectedSize.discountPrice > 0) {
      console.log('Using Discount Price:', this.selectedSize.discountPrice);
      return this.selectedSize.discountPrice;
    }

    // Nếu không có giá giảm, trả về giá gốc
    console.log('Using Regular Price:', this.selectedSize?.price);
    return this.selectedSize?.price ?? 0;
  }
  getCurrentUser() {
    // Fetch the current user from localStorage
    const currentUser = {
      userID: localStorage.getItem('userID'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      email: localStorage.getItem('email'),
      phoneNumber: localStorage.getItem('phoneNumber'),
      address: JSON.parse(localStorage.getItem('address') || '[]'),
      role: localStorage.getItem('role')
    };

    return currentUser;
  }
  addToCart() {
    console.log('Selected Product:', this.selectedProduct);
    console.log('Selected Size:', this.selectedSize);

    // Lấy userID từ localStorage và kiểm tra
    const userIdString = localStorage.getItem('userID');
    console.log("User ID from localStorage:", userIdString);

    const userId = userIdString ? Number(userIdString) : null;
    console.log("Converted User ID:", userId);

    // Nếu không có userId, yêu cầu người dùng đăng nhập lại
    if (userId === null || isNaN(userId) || userId <= 0) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedProduct || !this.selectedSize) {
      console.error('Please select a product and size before adding to cart.');
      alert('Vui lòng chọn sản phẩm và kích thước trước khi thêm vào giỏ hàng.');
      return;
    }

    const productImage = this.selectedProduct.image ? this.selectedProduct.image.split(',')[0].trim() : '';
    const currentPrice = this.getCurrentPrice();

    const cartItem = {
      productId: this.selectedProduct.productId,
      productSizeId: this.selectedSize.productSizeID,
      quantity: this.quantity,
      price: currentPrice,
      totalPrice: currentPrice * this.quantity,
      productName: this.selectedProduct.name,
      productImage: productImage,
      variant: this.selectedSize.variant,
      weight: this.selectedSize.weight,
      userId: userId
    };

    console.log('Cart item being sent to backend:', cartItem);
    this.cartService.addToCart(cartItem).subscribe(
      response => {
        console.log('Item added to cart:', response);
        alert("Đã thêm vào giỏ hàng");
        this.router.navigate(['/cart']);
      },
      error => {
        console.error('Error adding item to cart:', error);
        alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
      }
    );
  }


  getImageSrc(imageName: string): string {
    return this.formatImagePath(imageName);
  }
  getMinAndMaxPrice(sizes: any[]): { minPrice: number, maxPrice: number } {
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;

    sizes.forEach(size => {
      // Get the price, considering the discount price if available
      let price = size.discountPrice || size.price;

      if (price < minPrice) {
        minPrice = price;
      }
      if (price > maxPrice) {
        maxPrice = price;
      }
    });

    return { minPrice, maxPrice };
  }
  // Chia sẻ qua mạng xã hội (nút bấm riêng trên giao diện)
  // shareViaSocialMedia(): void {
  //   const productUrl = `${window.location.origin}/detail/${this.productId}`;
  //   const productName = this.productName;
  //   const shareText = `Xem sản phẩm "${productName}" tại: ${productUrl}`;

  //   console.log('Product URL:', productUrl);

  //   if (navigator.share) {
  //     navigator
  //       .share({
  //         title: 'Sản phẩm tuyệt vời!',
  //         text: shareText,
  //         url: productUrl,
  //       })
  //       .then(() => console.log('Chia sẻ thành công!'))
  //       .catch((error) => console.error('Error sharing:', error));
  //   } else {
  //     const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
  //     window.open(fbUrl, '_blank');
  //   }
  // }
  shareViaSocialMedia(): void {
    const productUrl = `https://localhost:4200/detail/${this.productId}`;  // Đảm bảo URL hợp lệ
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(fbUrl, '_blank');

  }


}
