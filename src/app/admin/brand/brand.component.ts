import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BrandService } from './brand.service';
import { Brand } from './brand';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';
import { NavbarClientComponent } from '../../navbar-client/navbar-client.component';
import { WishlistService } from '../../services/wishlist.service';


@Component({
  selector: 'app-brand',
  standalone: true, // Nếu bạn đang sử dụng standalone component
  imports: [CommonModule, NavbarClientComponent],  // Đảm bảo rằng CommonModule đã được thêm vào
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']

})
export class BrandComponent implements OnInit {
  brands: Brand[] = []; // Mảng chứa danh sách các thương hiệu
  wishlistItems: any[] = [];

  constructor(private brandService: BrandService, private router: Router, private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.getAllBrands(); // Gọi phương thức để lấy tất cả các thương hiệu
  }

  // Phương thức lấy tất cả các brand từ API
  private getAllBrands() {
    this.brandService.getBrand().subscribe(
      (data: Brand[]) => {
        this.brands = data; // Gán dữ liệu vào mảng brands
        console.log('All brands:', this.brands); // Kiểm tra dữ liệu
      },
      (error) => {
        console.error('Error fetching all brands:', error); // Xử lý lỗi nếu có
      }
    );
  }

  getEncodedImageUrl(imageName: string): string {
    return 'assets/brand/' + encodeURIComponent(imageName);
  }


  // Điều hướng đến trang hiển thị sản phẩm của thương hiệu
  viewBrandProducts(brandId: number) {
    this.router.navigate(['/brand', brandId]);
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
