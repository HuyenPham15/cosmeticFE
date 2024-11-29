import { Component, OnInit } from '@angular/core';
import { Productsize } from './productsize';
import { CommonModule } from '@angular/common';
import { ProductsizeService } from './productsize.service';

@Component({
  selector: 'app-producsize',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producsize.component.html',
  styleUrl: './producsize.component.scss'
})
export class ProducsizeComponent {
  productsize: Productsize[] = [];  // Sử dụng kiểu dữ liệu chính xác
  productsizeList: Productsize[] = []; // Danh sách kích thước sản phẩm

  constructor(private productsizeService: ProductsizeService) {}

  ngOnInit(): void {
    this.getProductsize();  // Gọi phương thức getProduct
  }

  private getProductsize() {
    this.productsizeService.getProductsize().subscribe(
      (productsize) => {
        this.productsize = productsize;  // Gán dữ liệu sản phẩm nhận được
        console.log('Products received:', this.productsize); // Kiểm tra sản phẩm nhận được
      },
      (error) => {
        console.error('Error fetching products:', error); // Xử lý lỗi nếu có
      }
    );
  }
  private loadProductSizes() {
    this.productsizeService.getProductsize().subscribe(
      (data) => {
        this.productsizeList = data.map(item => new Productsize(
          item.productSizeID,
          item.quantity,
          item.price,
          item.variant,

        )); // Chuyển đổi dữ liệu từ API thành đối tượng Productsize
        console.log('Loaded product sizes:', this.productsizeList);
      },
      (error) => {
        console.error('Error loading product sizes:', error);
      }
    );
  }
  

  

}
