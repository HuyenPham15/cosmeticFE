import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { Product } from '../admin/product';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute để truy cập tham số từ route
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category';
import { Brand } from '../brand/brand';
import { WishlistService } from '../../services/wishlist.service';
import { NavbarClientComponent } from "../../navbar-client/navbar-client.component";


@Component({
  selector: 'app-brandsp',
  standalone: true,
  imports: [CommonModule, NavbarClientComponent],
  templateUrl: './brandsp.component.html',
  styleUrl: './brandsp.component.scss'
})
export class BrandspComponent implements OnInit {
  products: Product[] = [];
  product: any = {}; // Khởi tạo đối tượng sản phẩm
  category: Category[] = [];
  brandId: number | null = null; // Biến để lưu trữ brandId lấy từ route
  featuredBrands: Brand[] = [];
  brands: Brand[] = []; // Mảng chứa danh sách các thương hiệu
  wishlistItems: any[] = [];
  isLiked: boolean = false; // Biến để lưu trạng thái 'Liked'




  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const brandIdParam = params.get('brandId');
      this.brandId = brandIdParam ? +brandIdParam : null; // Lấy brandId từ route

      if (this.brandId) {
        this.getProductsByBrandId(this.brandId); // Lấy sản phẩm dựa trên brandId
      } else {
        this.getProduct(); // Nếu không có brandId, lấy tất cả sản phẩm
      }
    });
    this.getCategory()

  }
  constructor(private productService: AdminService, private router: Router, private ngZone: NgZone, private categoryService: CategoryService, private route: ActivatedRoute, private wishlistService: WishlistService) { }

  getImageSrc(images: string | string[]): string {
    if (Array.isArray(images)) {
      // Nếu images là mảng, lấy phần tử đầu tiên
      return images.length > 0 ? `assets/upload/${images[0]}` : 'assets/upload/default-image.jpg';
    } else if (typeof images === 'string') {
      // Nếu images là chuỗi, phân tách chuỗi nếu có nhiều ảnh
      const imageArray = images.split(','); // Giả sử chuỗi ảnh được phân tách bởi dấu phẩy
      return imageArray.length > 0 ? `assets/upload/${imageArray[0]}` : 'assets/upload/default-image.jpg';
    } else {
      // Trả về ảnh mặc định nếu không có ảnh
      return 'assets/upload/default-image.jpg';
    }
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
        console.log('Products received:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  private getCategory() {
    this.categoryService.getCategory().subscribe(
      (Categorys) => {
        this.category = Categorys;
        console.log('Products received:', this.category);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Phương thức lấy sản phẩm theo brandId
  private getProductsByBrandId(brandId: number) {
    this.productService.getProductsByBrandId(brandId).subscribe(
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
        console.log('Products received:', this.products);
      },
      (error) => {
        console.error('Error fetching products by brandId:', error);
      }
    );
  }

  detailProduct(productID: string) {
    this.router.navigate(['/detail', productID]); // Điều hướng đến trang chi tiết với productID
  }


  getEncodedImageUrl(imageName: string): string {
    return 'assets/upload/brand/' + encodeURIComponent(imageName);
  }


  // Điều hướng đến trang hiển thị sản phẩm của thương hiệu
  viewBrandProducts(brandId: number) {
    this.router.navigate(['/brand', brandId]);  // Chuyển hướng tới trang brandsp với brandID
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
}