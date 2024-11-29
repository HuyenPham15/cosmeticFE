import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skintype } from '../skin-type/skin-type';
import { SkinTypeService } from '../skin-type/skin-type.service';

@Component({
  selector: 'app-skin-type',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skin-type.component.html',
  styleUrls: ['./skin-type.component.scss'] // Sửa 'styleUrl' thành 'styleUrls'
})
export class SkinTypeComponent implements OnInit {
  skintype: Skintype[] = []; 

  constructor(private skinTypeService: SkinTypeService) {}

  ngOnInit(): void {
    this.getSkinType();  // Gọi phương thức để lấy dữ liệu
  }

  private getSkinType() {
    this.skinTypeService.getSkintype().subscribe(
      (Skintype) => {
        this.skintype = Skintype;  // Gán dữ liệu nhận được
        console.log('Skin types received:', this.skintype); // Kiểm tra dữ liệu nhận được
      },
      (error) => {
        console.error('Error fetching skin types:', error); // Xử lý lỗi nếu có
      }
    );
  }
}
