import { Component, OnInit } from '@angular/core';
import { Subcategory } from '../subcategory/subcategory';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Thêm HttpClientModule ở đây
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  subcategories: Subcategory[] = [];  // Đặt tên biến chính xác hơn

  constructor(private subcategoryService: SubcategoryService) {}

  ngOnInit(): void {
    this.getSubcategories();  // Gọi phương thức lấy danh mục con
  }

  private getSubcategories() { // Đặt tên phương thức là getSubcategories
    this.subcategoryService.getSubcategory().subscribe(
      (subcategories) => { // Thay đổi biến từ Subcategorys thành subcategories
        this.subcategories = subcategories;  // Gán dữ liệu danh mục con nhận được
        console.log('Subcategories received:', this.subcategories); // Kiểm tra danh mục con nhận được
        this.subcategories.forEach(sub => console.log(sub)); // Kiểm tra từng đối tượng
      },
      (error) => {
        console.error('Error fetching subcategories:', error); // Xử lý lỗi nếu có
      }
    );
  }
}
