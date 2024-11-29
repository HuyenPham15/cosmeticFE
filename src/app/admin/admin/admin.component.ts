import { Component, OnInit, Renderer2 } from '@angular/core';
import { Product } from './product';
import { AdminService } from './admin.service';
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Discount_sp } from '../discount-sp/discount-sp';
import { DiscountSpService } from '../discount-sp/discount-sp.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AsideComponent, FormsModule, RouterModule, NgxPaginationModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  discounts: Discount_sp[] = []; // Danh sách discount
  product: any = {}; // Khởi tạo đối tượng sản phẩm
  selectedFiles: File[] = []; // Mảng lưu trữ tệp hình ảnh đã chọn
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  currentPage: number = 1; // Trang hiện tại cho phân trang
  itemsPerPage: number = 10; // Số sản phẩm mỗi trang
  sortField: string = ''; // Trường để sắp xếp
  sortDirection: string = 'asc'; // Hướng sắp xếp: 'asc' cho tăng dần, 'desc' cho giảm dần
  // Các biến để lưu giá trị đã chọn cho bộ lọc
  selectedSkinName: string = '';
  selectedBrand: string = '';
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  // Danh sách các giá trị duy nhất cho các bộ lọc
  uniqueSkins: string[] = [];
  uniqueBrands: string[] = [];
  uniqueCategories: string[] = [];
  uniqueSubcategories: string[] = [];

  constructor(private productService: AdminService, private router: Router, private ngZone: NgZone, private renderer: Renderer2, private discountspService: DiscountSpService) { }


  ngOnInit(): void {
    this.getProduct();
    this.filterProducts();
    this.getDiscounts();

  }
  // Hàm định dạng đường dẫn ảnh trong component product
  private formatImagePath(imageName: string): string {
    // Kiểm tra nếu đường dẫn đã có tiền tố `assets/upload/`
    if (imageName.startsWith('assets/upload/')) {
      return imageName;
    }
    return `assets/upload/${imageName}`;
  }

  getDiscounts(): void {
    this.discountspService.getDiscount_sp().subscribe({
      next: (response) => {
        this.discounts = response;
        console.log('Danh sách discounts:', this.discounts);
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách discounts:', error);
      }
    });
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
        this.filteredProducts = this.products; // Khởi tạo danh sách lọc
        // Tạo các giá trị duy nhất cho bộ lọc
        this.uniqueSkins = [...new Set(this.products.map(p => p.skinName))];
        this.uniqueBrands = [...new Set(this.products.map(p => p.brandName))];
        this.uniqueCategories = [...new Set(this.products.map(p => p.categoryName))];
        this.uniqueSubcategories = [...new Set(this.products.map(p => p.subcategoryName))];

        console.log('Products received:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );

  }


  deleteProduct(productID: string) {
    this.productService.deleteProduct(productID).subscribe(
      (response) => {
        console.log("Delete response:", response); // Log kết quả trả về
        alert("Sản phẩm đã được xóa thành công!"); // Thông báo thành công
        this.getProduct(); // Cập nhật lại danh sách sản phẩm
      },
      (error) => {
        console.error("Error deleting product:", error); // Log lỗi
        alert(error.error || "Có lỗi xảy ra khi xóa sản phẩm!");
      }
    );
  }

  updateProduct(productID: string) {
    this.router.navigate(['/edit', productID]); // Điều hướng đến trang edit với productID
  }


  detailProduct(productID: string) {
    this.router.navigate(['/detail', productID]); // Điều hướng đến trang chi tiết với productID
  }

  getImageSrc(imageName: string): string {
    // Kiểm tra nếu đường dẫn đã có tiền tố `assets/upload/`
    if (!imageName.startsWith('assets/upload/')) {
      return `assets/upload/${imageName}`;
    }
    return imageName;
  }

  getImageArray(images: string | string[]): string[] {
    if (typeof images === 'string') {
      return [images];  // Chuyển string thành mảng
    }
    return images;
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase();

    // Lọc sản phẩm dựa trên tiêu chí đã chọn và từ khóa tìm kiếm
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.productId.toString().toLowerCase().includes(term) ||
        product.productName.toLowerCase().includes(term) ||
        product.specifications.toLowerCase().includes(term) ||
        product.brandName.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.skinName.toLowerCase().includes(term) ||
        product.categoryName.toLowerCase().includes(term) ||
        product.review.toLowerCase().includes(term) ||
        product.subcategoryName.toLowerCase().includes(term) ||
        product.variant.toLowerCase().includes(term) ||
        product.quantity.toString().includes(term) ||
        product.price.toString().includes(term);

      const matchesSkin = this.selectedSkinName ? product.skinName === this.selectedSkinName : true;
      const matchesBrand = this.selectedBrand ? product.brandName === this.selectedBrand : true;
      const matchesCategory = this.selectedCategory ? product.categoryName === this.selectedCategory : true;
      const matchesSubcategory = this.selectedSubcategory ? product.subcategoryName === this.selectedSubcategory : true;

      // Sản phẩm phải thỏa mãn cả điều kiện tìm kiếm và các tiêu chí lọc
      return matchesSearch && matchesSkin && matchesBrand && matchesCategory && matchesSubcategory;
    });

    // Sắp xếp sản phẩm dựa trên trường và hướng sắp xếp
    this.filteredProducts = this.filteredProducts.sort((a, b) => {
      let comparison = 0;
      if (this.sortField === 'productID') {
        comparison = a.productId.localeCompare(b.productId); // So sánh mã sản phẩm theo chuỗi
      } else if (this.sortField === 'price') {
        comparison = a.price - b.price; // So sánh giá theo số
      } else if (this.sortField === 'quantity') {
        comparison = a.quantity - b.quantity; // So sánh số lượng theo số
      }

      // Đảo ngược kết quả nếu hướng sắp xếp là giảm dần
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  setSortField(field: string) {
    if (this.sortField === field) {
      // Nếu trường sắp xếp được chọn lại, đổi hướng sắp xếp
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Thiết lập trường sắp xếp mới và đặt hướng sắp xếp về tăng dần
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterProducts(); // Áp dụng bộ lọc và sắp xếp
  }

  updateDiscountSp(productID: string, discountsp_id: string): void {
    console.log(`Updating Discount for Product ID: ${productID} with Discount ID: ${discountsp_id}`);

    this.productService.updateDiscount(productID, discountsp_id).subscribe({
      next: () => {
        alert('Cập nhật Discount thành công!');

        // Cập nhật giao diện (nếu cần tải lại sản phẩm)
        this.getProduct(); // Hoặc cập nhật trực tiếp sản phẩm trong danh sách
      },
      error: (error) => {
        console.error('Cập nhật Discount thành công!', error);
        alert('Cập nhật Discount thành công!');
      }
    });
  }

  calculateFinalPrice(price: number, discountsp_id: string): number {
    // Tìm discount_sp dựa trên discountsp_id
    const discount = this.discounts.find(d => d.discountsp_id === discountsp_id);

    if (discount) {
      const discountValue = discount.discount_sp || 0; // Lấy giá trị giảm giá
      const finalPrice = price - (price * discountValue / 100); // Tính giá sau khi giảm
      return finalPrice > 0 ? finalPrice : 0; // Đảm bảo giá không âm
    }
    return price; // Trả về giá gốc nếu không có giảm giá
  }

  removeDiscount(productID: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa Discount khỏi sản phẩm này không?')) {
      this.productService.removeDiscount(productID).subscribe({
        next: (response) => {
          alert(response); // Hiển thị thông báo từ API
          this.getProduct(); // Tải lại danh sách sản phẩm
        },
        error: (error) => {
          if (error.status === 400) {
            alert('Sản phẩm không có Discount để xóa.'); // Hiển thị lỗi từ API
          } else {
            alert('Đã xảy ra lỗi khi xóa Discount. Vui lòng thử lại!');
          }
          console.error('Lỗi khi xóa Discount:', error);
        }
      });
    }
  }





} 