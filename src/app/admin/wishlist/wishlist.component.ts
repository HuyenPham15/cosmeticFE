import { Component } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CommonHoverOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  product: any = {}; // Khởi tạo đối tượng sản phẩm
  wishlistItems: any[] = [];
  productID: string='';
  isLiked: boolean = false; 
  userID: string='U004';
  constructor(private wishlistService: WishlistService,) { }
 
  ngOnInit(): void {
  
    this.getWishlist(this.userID);
    console.log('sản phẩm yêu thích',this.wishlistItems); 
   
 
  }
  removeFromWishlist(productID: string): void {
    const userID = 'U004'; // Giả sử userID là 'U004'
  
    if (!productID) {
      console.error('Không tìm thấy ProductID');
      return; // Nếu productID không được định nghĩa, không thực hiện gì
    }
     
    console.log('Bỏ thích sản phẩm:', productID); // Kiểm tra giá trị của productID
    alert('Đã xoá sản phẩm khỏi danh sách yêu thích')
    window.location.reload(); // Làm mới trang

    this.wishlistService.removeProductFromWishlist(userID, productID).subscribe(
      (response) => {
        console.log('Bỏ Thích Sản Phẩm Thành Công', response);
       
        // Sau khi xóa sản phẩm, lấy lại danh sách wishlist
        this.getWishlist(userID);

      },
      (error) => {
        console.error('Lỗi', error);
      }
    );
  }
  

  getWishlist(userID: string): void {
    this.wishlistService.getWishlist(userID).subscribe(
      (data) => {
        console.log('Danh sách yêu thích:', data); // Kiểm tra dữ liệu
        this.wishlistItems = data;
      },
      (error) => {
        console.error('Lỗi', error);
      }
    );
  }
  getImageSrc(imageName: string | undefined): string {
    if (!imageName) return ''; // Trả về chuỗi rỗng nếu imageName là undefined hoặc rỗng

    const firstImage = imageName.includes(',') ? imageName.split(',')[0].trim() : imageName;
    return firstImage.startsWith('assets/upload/') ? firstImage : `assets/upload/${firstImage}`;
  }
  
}
