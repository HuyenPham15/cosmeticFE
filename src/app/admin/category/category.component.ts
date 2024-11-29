import { Component, OnInit } from '@angular/core';
import { Category } from './category';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from './category.service';
import { Product } from '../admin/product';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Subcategory } from '../subcategory/subcategory';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { error } from 'console';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: Category[] = [];
  allProducts: Product[] = []; // Danh sách toàn bộ sản phẩm
  products: Product[] = []; // Sản phẩm của danh mục đã chọn
  filteredProducts: Product[] = []; // Sản phẩm đã lọc (dựa trên tìm kiếm hoặc danh mục)
  paginatedProducts: Product[] = [];

  keyword: string = ''; // Từ khóa tìm kiếm
  currentPage: number = 1;
  productsPerPage: number = 8;
  totalPages: number = 1;
  pages: number[] = [];
  subcategory: Subcategory[] = [];
  selectedCategoryID: number | null = null;
  subcategoryProducts: Product[] = [];
  selectedSubcategoryID: number[] = [];
  selectedCategoryName: string = '';
  selectedSubcategoryName: string = '';
  selectedCategoryName1: string = '';
  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: AdminService,
    private subcategoryService: SubcategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategory();
    this.loadAllProducts(); // Tải toàn bộ sản phẩm khi khởi tạo
    const categoryID = Number(this.route.snapshot.paramMap.get('id'));
    if (categoryID) {
      this.getProductsByCategory(categoryID); // Gọi phương thức lấy danh sách sản phẩm
    }
  }

  private loadAllProducts(): void {
    this.productService.getProduct().subscribe(
      (products) => {
        this.allProducts = products.map(product => {
          let firstImage = '';
          if (typeof product.images === 'string') {
            const imagesArray = product.images.split(',');
            firstImage = imagesArray[0];
          } else if (Array.isArray(product.images)) {
            firstImage = product.images[0];
          }
          return { ...product, firstImage };
        });
      },
      (error) => {
        console.error('Error fetching all products:', error);
      }
    );
  }

  private getProductbySubcategory(subcategoryID: number): void {
    this.subcategoryService.getProductBySubcategory(subcategoryID).subscribe(
      (data: Product[]) => {
        // Đặt lại danh sách sản phẩm đã lọc chỉ với sản phẩm của danh mục con đã chọn
        this.filteredProducts = data.map(product => {
          let firstImage = '';
          if (typeof product.images === 'string') {
            const imagesArray = product.images.split(',');
            firstImage = imagesArray[0];
          }
          return { ...product, firstImage };
        });
        this.setupPagination(); // Cập nhật phân trang nếu cần
      },
      (error) => {
        console.log('Lỗi Khi Lấy Sản Phẩm ', error);
      }
    );
  }
  private getSubcategoriesByCategory(categoryID: number): void {
    this.categoryService.getSubcategoriesByCategory(categoryID).subscribe(
      (subcategory) => {
        this.subcategory = subcategory; // Giả sử subcategory có cấu trúc { subcategoryID, subcategoryName }
        console.log('Subcategories received:', this.subcategory);
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
      }
    );
  }
  public getProductsByCategory(categoryID: number): void {
    this.selectedCategoryID = categoryID;
    this.selectedSubcategoryID = []; // Xóa danh mục con và sản phẩm đã lọc
    this.selectedSubcategoryName = '';
    this.filteredProducts = []; // Reset danh sách sản phẩm
  
    // Lấy danh mục con
    this.categoryService.getSubcategoriesByCategory(categoryID).subscribe(
      (subcategory) => {
        this.subcategory = subcategory;
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
      }
    );
  
    // Lấy thông tin danh mục
    this.categoryService.getCategoryByID(categoryID).subscribe(
      (category) => {
        if (category && category.categoryName) {
          this.selectedCategoryName1 = category.categoryName;
          this.selectedCategoryName = category.categoryName;
        } else {
          console.log('Category name not found');
        }
      },
      (error) => {
        console.error('Error fetching category details:', error);
      }
    );
  
    // Lấy sản phẩm theo danh mục
    this.productService.getProductsByCategory(categoryID).subscribe(
      (products) => {
        this.products = products.map(product => {
          let firstImage = '';
          if (typeof product.images === 'string') {
            const imagesArray = product.images.split(',');
            firstImage = imagesArray[0];
          } else if (Array.isArray(product.images)) {
            firstImage = product.images[0];
          }
          return { ...product, firstImage };
        });
  
        this.filteredProducts = [...this.products]; // Cập nhật danh sách sản phẩm được lọc
        this.setupPagination(); // Cập nhật phân trang
      },
      (error) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }
  
selectCategory(categoryID: number, event: Event): void {

  this.router.navigate(['/category', categoryID]).then(() => {
    this.getProductsByCategory(categoryID); // Gọi phương thức lấy sản phẩm
  });
}


  private getCategory() {
    this.categoryService.getCategory().subscribe(
      (categories) => {
        this.category = categories;
        console.log('Categories received:', this.category);
        window.location.reload();
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  public searchProducts(): void {
    const keywordLower = this.keyword.toLowerCase();

    if (this.keyword.trim()) {
      // Nếu có từ khóa tìm kiếm, lọc từ `allProducts`
      this.filteredProducts = this.allProducts.filter(product =>
        product.productName.toLowerCase().includes(keywordLower)
      );
    } else if (this.selectedCategoryID) {
      // Nếu không có từ khóa nhưng có danh mục, chỉ hiển thị sản phẩm theo danh mục
      this.getProductsByCategory(this.selectedCategoryID);
      return;
    } else {
      // Nếu không có từ khóa và không có danh mục, hiển thị toàn bộ sản phẩm
      this.filteredProducts = [...this.allProducts];
    }

    // Cập nhật phân trang
    this.setupPagination();
  }

  private setupPagination() {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginateProducts();
  }

  private paginateProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateProducts();
    }
  }

  getImageSrc(imageName: string | undefined): string {
    if (!imageName) return '';
    const firstImage = imageName.includes(',') ? imageName.split(',')[0].trim() : imageName;
    return firstImage.startsWith('assets/upload/') ? firstImage : `assets/upload/${firstImage}`;
  }

  onSubcategoryClick(subcategoryID: number): void {
    // Đặt lại mảng danh mục con đã chọn chỉ với danh mục con hiện tại
    this.selectedSubcategoryID = [subcategoryID];
    this.subcategoryService.getSubcategoryByID(subcategoryID).subscribe(
      (subcategory) => {
        console.log('Received subcategory:', subcategory);  // Kiểm tra dữ liệu nhận được từ API
        if (subcategory && subcategory.subcategoryName) {
          this.selectedSubcategoryName = subcategory.subcategoryName;
          this.selectedCategoryName = subcategory.subcategoryName;
          console.log('subategory Name:', this.selectedSubcategoryName); // Kiểm tra lại giá trị đã gán
          window.location.reload();
        } else {
          console.log('Subategory name not found');
        }
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin subcategory', error);
      }

    )


    // Lấy sản phẩm của danh mục con đã chọn
    this.filterProductsBySubcategory(subcategoryID);
  }



  filterProductsBySubcategory(subcategoryID: number): void {
    if (this.selectedSubcategoryID.length > 0) {
      // Nếu có danh mục con được chọn, hiển thị sản phẩm thuộc danh mục con
      const productRequests = this.selectedSubcategoryID.map(subcategoryID =>
        this.subcategoryService.getProductBySubcategory(subcategoryID).toPromise()
      );

      Promise.all(productRequests)
        .then(results => {
          // Gom tất cả các sản phẩm từ các danh mục con
          this.filteredProducts = results.flat().map(product => {
            let firstImage = '';
            if (typeof product.images === 'string') {
              const imagesArray = product.images.split(',');
              firstImage = imagesArray[0];
            }
            return { ...product, firstImage };
          });

          this.filteredProducts = [...new Set(this.filteredProducts)]; // Loại bỏ trùng lặp
          this.setupPagination(); // Cập nhật phân trang nếu cần
          window.location.reload();
        })
        .catch(error => {
          console.log('Lỗi Khi Lấy Sản Phẩm ', error);
        });
    } else {
      // Nếu không có danh mục con nào được chọn, hiển thị sản phẩm của danh mục chính
      this.filteredProducts = [...this.products];
      this.setupPagination(); // Cập nhật phân trang nếu cần
    }
  }





}