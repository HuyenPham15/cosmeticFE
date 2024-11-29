import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../ts/product';
import { Category } from '../ts/Category';
import { Brand } from '../ts/Brand';
import { ProductService } from '../services/product.service';
import { WishlistService } from '../services/wishlist.service';
import { CategoryService } from '../services/category.service';
import { FormsModule } from '@angular/forms';
import { NavbarClientComponent } from "../navbar-client/navbar-client.component";
import { HttpClient } from '@angular/common/http';

declare function bannerSwiper(): void;
declare function initSwiper(): void;
declare function toggleChatbox(): void;
declare function brandSwiper(): void;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarClientComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  employees: any[] = [];
  role: string | null = null;
  userID: number = 0;
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  product: any = {};
  category: Category[] = [];
  keyword: string = '';
  featuredBrands: Brand[] = [];
  currentProducts: Product[] = [];
  isLiked: boolean = false;
  productID: string = '';
  wishlistItems: any[] = [];
  currentPage: number = 1;
  productsPerPage: number = 8;
  totalPages: number = 1;
  pages: number[] = [];
  brands: Brand[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private wishListService: WishlistService,
    private categoryService: CategoryService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.role = localStorage.getItem('role');
      this.userID = Number(localStorage.getItem('userID')) || 0; // Now initialized in ngOnInit
      console.log('Logged in role:', this.role);
      initSwiper();
      bannerSwiper();
      toggleChatbox();
      brandSwiper();
    }


    this.getProduct();
    this.getFeaturedBrands();
  }

  get firstName(): string | null {
    return this.getItemFromLocalStorage('firstName');
  }

  get userEmail(): string | null {
    return this.getItemFromLocalStorage('email');
  }

  private getItemFromLocalStorage(key: string): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('email');
      localStorage.removeItem('firstName');
      localStorage.removeItem('userID');
    }
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    const userIdString = localStorage.getItem('userID'); // Lấy userId từ localStorage
    return userIdString !== null; // Trả về true nếu người dùng đã đăng nhập
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.logout();
  }
  private getProduct() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products.map(product => {
          let firstImage = ''; // Khởi tạo giá trị mặc định cho firstImage
          if (typeof product.images === 'string') {
            const imagesArray = product.images.split(','); // Phân tách chuỗi thành mảng
            firstImage = imagesArray[0]; // Lấy ảnh đầu tiên
          } else if (Array.isArray(product.images)) {
            firstImage = product.images[0]; // Nếu là mảng, lấy ảnh đầu tiên
          }

          return { ...product, firstImage }; // Thêm thuộc tính firstImage vào sản phẩm
        });
        console.log("Sản phẩm:", products)
        this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.paginateProducts();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  private paginateProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }
  getImageSrc(imageName: string): string {
    // Kiểm tra nếu đường dẫn đã có tiền tố `assets/upload/`
    if (!imageName.startsWith('assets/upload/')) {
      return `assets/upload/${imageName}`;
    }
    return imageName;
  }
  detailProduct(productId: string) {
    this.router.navigate(['/detail', productId]); // Điều hướng đến trang chi tiết với productID
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateProducts();
    }
  }
  getWishlist(userID: string): void {
    this.wishListService.getWishlist(userID).subscribe(
      (data) => {
        this.wishlistItems = data; // Bây giờ data sẽ chứa các chi tiết sản phẩm
        console.log(this.wishlistItems); // Kiểm tra dữ liệu để xác nhận
      },
      (error) => {
        console.error('Error fetching wishlist', error);
      }
    );
  }

  addToWishlist(productID: string): void {
    const userID = 'U004'; // Giả sử đây là userId của người dùng
    alert('Đã thêm sản phẩm vào danh sách yêu thích')
    // Gọi service để thêm sản phẩm vào wishlist
    this.wishListService.addProducttoWishlist(userID, productID).subscribe(
      (response) => {

        console.log('Product added to wishlist successfully!', response);
        // Sau khi thêm sản phẩm, lấy lại danh sách wishlist
        this.getWishlist(userID);

      },
      (error) => {
        console.error('Error adding product to wishlist', error);
      }
    );
  }
  getEncodedImageUrl(imageName: string): string {
    return 'assets/brand/' + encodeURIComponent(imageName);
  }
  getFeaturedBrands(): void {
    this.productService.getFeaturedBrands().subscribe(
      (data: Brand[]) => {
        this.featuredBrands = data;
      },
      (error) => {
        console.error('Error fetching featured brands:', error);
      }
    );
  }

  viewBrandProducts(brandId: number) {
    this.router.navigate(['/brand', brandId]);  // Chuyển hướng tới trang brandsp với brandID
  }

  shareProduct(product: any) {
    const productUrl = `${window.location.origin}/product/${product.productId}`; // URL sản phẩm
    const productName = product.name; // Tên sản phẩm

    const shareChoice = confirm("Bạn muốn chia sẻ sản phẩm qua email hoặc mạng xã hội?");
    if (shareChoice) {
      // Chia sẻ qua email
      const email = prompt("Nhập email người nhận:");
      if (email) {
        this.shareViaEmail(email, productName, productUrl);
      } else {
        console.log("Không nhập email, bỏ qua chia sẻ qua email.");
      }

      // Chia sẻ qua mạng xã hội
      const shareText = `Xem sản phẩm "${productName}" tại: ${productUrl}`;
      this.shareViaSocialMedia(shareText);
    }
  }
  private shareViaEmail(email: string, productName: string, productUrl: string): void {
    const emailBody = `Xem sản phẩm "${productName}" tại: ${productUrl}`;
    const payload = { email, body: emailBody }; // Dữ liệu gửi tới API

    this.httpClient.post('/api/share/email', payload).subscribe(
      (response) => {
        console.log('Email sent successfully!', response);
        alert('Email đã được gửi thành công!');
      },
      (error) => {
        console.error('Error sending email', error);
        alert('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại!');
      }
    );
  }


  // Chia sẻ qua mạng xã hội
  private shareViaSocialMedia(shareText: string): void {
    if (navigator.share) {
      navigator.share({
        title: 'Sản phẩm tuyệt vời!',
        text: shareText,
        url: window.location.href
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Nếu không hỗ trợ, sử dụng liên kết mạng xã hội
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
      window.open(fbUrl, '_blank');
    }
  }
}
