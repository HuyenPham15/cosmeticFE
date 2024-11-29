import { Component, OnInit } from '@angular/core';
import { Category } from '../../ts/Category';
import { Product } from '../../ts/product';
import { Subcategory } from '../../ts/Subcategory';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarClientComponent } from "../../navbar-client/navbar-client.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarClientComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
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
    private productService: ProductService,
    private subcategoryService: SubcategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategory();
    this.loadAllProducts(); // Tải toàn bộ sản phẩm khi khởi tạo
    const categoryID = Number(this.route.snapshot.paramMap.get('categoryID'));
    this.getProductsByCategory(categoryID);
  }

  private loadAllProducts(): void {
    this.productService.getAllProducts().subscribe(
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
  getMinAndMaxPrice(sizes: any[]): { minPrice: number, maxPrice: number } {
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;

    sizes.forEach(size => {
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
  detailProduct(productId: string) {
    this.router.navigate(['/detail', productId]); // Điều hướng đến trang chi tiết với productID
  }
  public getProductsByCategory(categoryID: number): void {
    this.selectedCategoryID = categoryID;
    this.selectedSubcategoryID = [];  // Xóa danh sách danh mục con và sản phẩm đã lọc khi chuyển sang danh mục mẹ mới
    this.selectedSubcategoryName = '';
    this.filteredProducts = [];

    this.categoryService.getSubcategoriesByCategory(categoryID).subscribe(
      (subcategory) => {
        this.subcategory = subcategory;
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
      }
    );

    this.categoryService.getCategoryByID(categoryID).subscribe(
      (category) => {
        console.log('Received category:', category);  // Kiểm tra dữ liệu nhận được từ API
        if (category && category.categoryName) {
          this.selectedCategoryName1 = category.categoryName;
          this.selectedCategoryName = category.categoryName;
          console.log('Category Name:', this.selectedCategoryName1); // Kiểm tra lại giá trị đã gán
        } else {
          console.log('Category name not found');
        }
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin danh mục mẹ:', error);
      }
    );

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

        this.filteredProducts = [...this.products];
        this.setupPagination();
      },
      (error) => {
        console.error('Error fetching products by category:', error);
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
    this.selectedSubcategoryID = [subcategoryID];
    this.subcategoryService.getSubcategoryByID(subcategoryID).subscribe(
      (subcategory) => {
        console.log('Received subcategory:', subcategory);  // Kiểm tra dữ liệu nhận được từ API
        if (subcategory && subcategory.subcategoryName) {
          this.selectedSubcategoryName = subcategory.subcategoryName;
          this.selectedCategoryName = subcategory.subcategoryName;
          console.log('subategory Name:', this.selectedSubcategoryName); // Kiểm tra lại giá trị đã gán
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
