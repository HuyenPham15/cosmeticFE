import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category } from '../ts/Category';
import { ProductService } from '../services/product.service';
import { Product } from '../ts/product';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-client.component.html',
  styleUrl: './navbar-client.component.scss'
})
export class NavbarClientComponent implements OnInit {
  role: string | null = null;
  userID: number = 0;
  category: Category[] = [];
  selectedCategoryID: number | null = null;
  filteredProducts: Product[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];
  productsPerPage: number = 8;
  paginatedProducts: Product[] = [];
  products: Product[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryID = params['categoryID'];
      if (categoryID) {
        this.getProductsByCategory(categoryID);
      }
    });
    if (isPlatformBrowser(this.platformId)) {
      this.role = localStorage.getItem('role');
      this.userID = Number(localStorage.getItem('userID')) || 0; // Now initialized in ngOnInit
      console.log('Logged in role:', this.role);
    }
    this.getCategory();
    if (isPlatformBrowser(this.platformId)) {
      const userId = Number(localStorage.getItem('userID'));
      if (userId) {
        this.cartService.getUniqueProductCount(userId).subscribe(
          (count) => {
            this.uniqueProductCount = count;
          },
          (error) => {
            console.error('Error fetching unique product count:', error);
          }
        );
      }
    }
  }
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private cartService: CartService

  ) {

  }
  uniqueProductCount: number = 0;
  get firstName(): string | null {
    return this.getItemFromLocalStorage('firstName');
  }
  get userEmail(): string | null {
    return this.getItemFromLocalStorage('email');
  }
  private getItemFromLocalStorage(key: string): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
  }

  public getProductsByCategory(categoryID: number): void {
    this.selectedCategoryID = categoryID;
    this.productService.getProductsByCategory(categoryID).subscribe(
      (products) => {
        this.filteredProducts = products.map(product => {
          let firstImage = '';
          if (typeof product.images === 'string') {
            const imagesArray = product.images.split(',');
            firstImage = imagesArray[0];
          } else if (Array.isArray(product.images)) {
            firstImage = product.images[0];
          }
          return { ...product, firstImage };
        });

        // Cập nhật giao diện ngay sau khi dữ liệu thay đổi
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.paginateProducts();

        this.cdr.detectChanges(); // Thêm dòng này
      },
      (error) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }

  private getCategory() {
    this.productService.getCategory().subscribe(
      (categories) => {
        this.category = categories;
        console.log('Categories received:', this.category);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  private paginateProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end); // Dùng filteredProducts thay vì products
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('email');
      localStorage.removeItem('firstName');
      localStorage.removeItem('userID');
    }
    this.router.navigate(['/login']);
  }
}
