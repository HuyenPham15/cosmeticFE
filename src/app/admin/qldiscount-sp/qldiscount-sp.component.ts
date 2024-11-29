import { Component, OnInit } from '@angular/core';
import { DiscountSpService } from '../discount-sp/discount-sp.service';
import { Discount_sp } from '../discount-sp/discount-sp';
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-qldiscount-sp',
  standalone: true,
  imports: [CommonModule, AsideComponent, FormsModule, RouterModule, NgxPaginationModule],
  templateUrl: './qldiscount-sp.component.html',
  styleUrls: ['./qldiscount-sp.component.scss']
})
export class QldiscountSpComponent implements OnInit {
  searchTerm: string = '';
  filteredDiscounts: Discount_sp[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  discounts: Discount_sp[] = [];

  constructor(private discountSpService: DiscountSpService, private router: Router) { }

  ngOnInit(): void {
    this.loadDiscounts(); // Tải danh sách mã giảm giá khi khởi tạo component
    this.discountSpService.getDiscount_sp().subscribe({
      next: (data) => {
        this.discounts = data;
        this.filteredDiscounts = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách mã giảm giá:', err);
      }
    });
  }
  loadDiscounts(): void {
    this.discountSpService.getDiscount_sp().subscribe({
      next: (data) => {
        this.discounts = data;
        this.filteredDiscounts = data; // Gán danh sách ban đầu vào filteredDiscounts để lọc
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách mã giảm giá:', err);
        alert('Đã xảy ra lỗi khi tải danh sách mã giảm giá.');
      }
    });
  }

  filterDiscounts(): void {
    if (this.searchTerm) {
      this.filteredDiscounts = this.discounts.filter((discount) =>
        discount.discountsp_id.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredDiscounts = this.discounts;
    }
  }

  setSortField(field: string): void {
    this.filteredDiscounts = [...this.filteredDiscounts].sort((a, b) => {
      if ((a as any)[field] < (b as any)[field]) return -1;
      if ((a as any)[field] > (b as any)[field]) return 1;
      return 0;
    });
  }


  // Lấy tất cả các discount_sp từ dịch vụ
  getAllDiscounts(): void {
    this.discountSpService.getDiscount_sp().subscribe({
      next: (data) => {
        this.discounts = data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách khuyến mãi:', err);
        alert('Đã xảy ra lỗi khi lấy danh sách khuyến mãi. Vui lòng thử lại sau.');
      }
    });
  }


  // Xóa mềm discount_sp
  deleteDiscount(id: string): void {
    this.discountSpService.deleteDiscount_sp(id).subscribe({
      next: () => {
        alert('Mã giảm giá đã được xóa thành công.');
        this.loadDiscounts(); // Tải lại danh sách mã giảm giá sau khi xóa
      },
      error: (err) => {
        if (err.status === 403) {
          alert('Mã giảm giá đang hoạt động, không thể xóa.');
        } else {
          console.error('Lỗi khi xóa mã giảm giá:', err);
          alert('Đã xảy ra lỗi khi xóa mã giảm giá. Vui lòng thử lại.');
        }
      }
    });
  }



  // Phương thức để cập nhật mã giảm giá
  updateDiscount_sp(discountId: string): void {
    // Điều hướng đến trang cập nhật với ID mã giảm giá
    this.router.navigate(['/update-discountsp', discountId]);
  }

}
