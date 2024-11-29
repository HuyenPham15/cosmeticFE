import { Component, OnInit } from '@angular/core';
import { DiscountService } from './discount.service';  // Import DiscountService
import { Discount } from './discount';  // Import model Discount
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule để sử dụng [(ngModel)]
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-discount-management',
  standalone: true,  // Thêm standalone: true
  imports: [CommonModule, AsideComponent, FormsModule, NgxPaginationModule],
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  discounts: Discount[] = [];
  filteredDiscounts: Discount[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortField: string = '';
  sortDirection: string = 'asc';
  isModalOpen: boolean = false;
  selectedDiscount: Discount = new Discount(); // Khởi tạo mặc định thay vì để null
  errorMessage = '';



  constructor(private discountService: DiscountService, private router: Router,) { }

  ngOnInit(): void {
    this.getAllDiscounts();
    this.loadValidDiscounts();
  }

  loadValidDiscounts(): void {
    this.discountService.getDiscounts().subscribe(
      (discounts) => {
        this.discounts = discounts;
      },
      (error) => {
        this.errorMessage = 'Không thể tải danh sách giảm giá.';
        console.error('Error fetching discounts:', error);
      }
    );
  }
  // Lấy tất cả các khuyến mãi từ service
  getAllDiscounts(): void {
    this.discountService.getAllDiscounts().subscribe((data: Discount[]) => {
      this.discounts = data;
      this.filteredDiscounts = this.discounts;
    });
  }

  // Tìm kiếm discount
  searchDiscounts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDiscounts = this.discounts.filter(discount =>
      discount.discountID.toLowerCase().includes(term) ||
      discount.discountCode.toLowerCase().includes(term)
    );
  }

  // Sắp xếp discount theo trường
  setSortField(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortDiscounts();
  }

  // Hàm sắp xếp discount
  sortDiscounts(): void {
    this.filteredDiscounts.sort((a, b) => {
      let comparison = 0;
      if (this.sortField === 'discount_id') {
        comparison = a.discountID.localeCompare(b.discountID);
      } else if (this.sortField === 'discountCode') {
        comparison = a.discountCode.localeCompare(b.discountCode);
      } else if (this.sortField === 'amount') {
        comparison = a.amount - b.amount;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  updateDiscount(discountID: string) {
    // Điều hướng đến trang cập nhật mã giảm giá với ID mã giảm giá
    this.router.navigate(['/update-discount', discountID]);
  }

  // Đóng modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedDiscount = new Discount(); // Khởi tạo đối tượng Discount mới
  }

  // Xác nhận cập nhật discount
  confirmUpdateDiscount(): void {
    if (this.selectedDiscount) {
      console.log('Updating discount:', this.selectedDiscount);
      this.discountService.updateDiscount(this.selectedDiscount.discountID, this.selectedDiscount)
        .subscribe(response => {
          console.log('Discount updated', response);
          this.isModalOpen = false;
          this.getAllDiscounts();  // Làm mới danh sách sau khi cập nhật
        }, error => {
          console.error('Error updating discount:', error);
        });
    }
  }

}
