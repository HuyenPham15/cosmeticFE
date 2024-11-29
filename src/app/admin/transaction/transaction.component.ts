import { Component, OnInit } from '@angular/core';
import { AsideComponent } from '../../aside/aside.component'; // Import AsideComponent
import { CommonModule } from '@angular/common';
import { Transaction } from '../transaction/transaction';
import { TransactionService } from '../transaction/transaction.service';


@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, AsideComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {
  transaction: Transaction[] = [];  // Sử dụng kiểu dữ liệu chính xác

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getTransaction();
      // Gọi phương thức 
  }
  private getTransaction() {
    this.transactionService.getTransaction().subscribe(
      (transaction) => {
        this.transaction = transaction;  // Gán dữ liệu sản phẩm nhận được
        console.log('transaction received:', this.transaction); // Kiểm tra sản phẩm nhận được
      },
      (error) => {
        console.error('Error fetching transaction:', error); // Xử lý lỗi nếu có
      }
    );
  }
}
