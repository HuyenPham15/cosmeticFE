import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { Product } from '../admin/product';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category';
import { FormsModule } from '@angular/forms';
import { Brand } from '../brand/brand';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { WishlistService } from '../wishlist/wishlist.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = []; // Mảng lưu trữ sản phẩm phân trang
  filteredProducts: Product[] = []; // Mảng lưu trữ sản phẩm đã lọc
  product: any = {}; // Khởi tạo đối tượng sản phẩm
  category: Category[] = [];
  keyword: string = ''; // Thuộc tính lưu từ khóa tìm kiếm
  featuredBrands: Brand[] = [];
  currentProducts: Product[] = []; // Products on the current page
  selectedCategoryID: number | null = null; // ID danh mục được chọn
  isLiked: boolean = false; // Biến để lưu trạng thái 'Liked'
  userID: string = 'U004';
  productID: string = '';
  wishlistItems: any[] = [];



  // Thuộc tính phân trang
  currentPage: number = 1;       // Trang hiện tại
  productsPerPage: number = 8;   // Số sản phẩm trên mỗi trang
  totalPages: number = 1;        // Tổng số trang
  pages: number[] = [];          // Mảng lưu số trang
  brands: Brand[] = []; // Mảng chứa danh sách các thương hiệu


  ngOnInit(): void {
    this.getProduct();
    this.getCategory();
    this.getFeaturedBrands();
    this.userID;
  }

  constructor(
    private productService: AdminService,
    private router: Router,
    private ngZone: NgZone,
    private categoryService: CategoryService,
    private wishlistService: WishlistService
  ) { }

  public searchProducts(): void {
    // Kiểm tra nếu có từ khóa tìm kiếm
    if (this.keyword.trim()) {
      const keywordLower = this.keyword.toLowerCase();
      // Tìm kiếm trong toàn bộ danh sách sản phẩm gốc
      this.filteredProducts = this.products.filter(product =>
        product.productName.toLowerCase().includes(keywordLower)
      );
    } else if (this.selectedCategoryID) {
      // Nếu không có từ khóa nhưng có danh mục được chọn, chỉ lọc theo danh mục
      this.getProductsByCategory(this.selectedCategoryID);
      return;
    } else {
      // Nếu không có từ khóa và không có danh mục, hiển thị tất cả sản phẩm
      this.filteredProducts = [...this.products];
    }

    // Cập nhật phân trang
    this.currentPage = 1; // Reset về trang đầu tiên
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginateProducts();
  }
  getImageSrc(imageName: string): string {
    // Kiểm tra nếu đường dẫn đã có tiền tố `assets/upload/`
    if (!imageName.startsWith('assets/upload/')) {
      return `assets/upload/${imageName}`;
    }
    return imageName;
  }

  private getProduct() {
    this.productService.getProduct().subscribe(
      (products) => {
        this.products = products.map(product => {
          // Kiểm tra xem product.images có phải là chuỗi không
          let firstImage = ''; // Khởi tạo giá trị mặc định cho firstImage
          if (typeof product.images === 'string') {
            const imagesArray = product.images.split(','); // Phân tách chuỗi thành mảng
            firstImage = imagesArray[0]; // Lấy ảnh đầu tiên
          } else if (Array.isArray(product.images)) {
            firstImage = product.images[0]; // Nếu là mảng, lấy ảnh đầu tiên
          }

          return { ...product, firstImage }; // Thêm thuộc tính firstImage vào sản phẩm
        });

        // Xử lý phân trang
        this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.paginateProducts();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  private getCategory() {
    this.categoryService.getCategory().subscribe(
      (categories) => {
        this.category = categories;
        console.log('Categories received:', this.category);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Hàm phân trang
  private paginateProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }

  // Chuyển đến trang được chọn
  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateProducts();
    }
  }
  //brand
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
  getEncodedImageUrl(imageName: string): string {
    return 'assets/upload/brand/' + encodeURIComponent(imageName);
  }


  // Điều hướng đến trang hiển thị sản phẩm của thương hiệu
  viewBrandProducts(brandId: number) {
    this.router.navigate(['/brand', brandId]);  // Chuyển hướng tới trang brandsp với brandID
  }
  detailProduct(productID: string) {
    this.router.navigate(['/detail', productID]); // Điều hướng đến trang chi tiết với productID
  }

  getWishlist(userID: string): void {
    this.wishlistService.getWishlist(userID).subscribe(
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
    this.wishlistService.addProducttoWishlist(userID, productID).subscribe(
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

  public getProductsByCategory(categoryID: number): void {
    this.selectedCategoryID = categoryID; // Cập nhật danh mục được chọn
    this.productService.getProductsByCategory(categoryID).subscribe(
      (products) => {
        this.filteredProducts = products.map(product => {
          let firstImage = ''; // Khởi tạo giá trị mặc định cho firstImage
          if (typeof product.images === 'string') {
            const imagesArray = product.images.split(','); // Phân tách chuỗi thành mảng
            firstImage = imagesArray[0]; // Lấy ảnh đầu tiên
          } else if (Array.isArray(product.images)) {
            firstImage = product.images[0]; // Nếu là mảng, lấy ảnh đầu tiên
          }

          return { ...product, firstImage }; // Thêm thuộc tính firstImage vào sản phẩm
        });

        // Xử lý phân trang sau khi lọc theo danh mục
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.paginateProducts();
      },
      (error) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }

}