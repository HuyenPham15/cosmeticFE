import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Để hỗ trợ *ngFor và *ngIf
import { HttpClientModule } from '@angular/common/http';  // Để sử dụng HttpClient
import { StatisticsService } from './statistics.service';
import { DailyRevenueDTO, MonthlyRevenueDTO } from './model';
import { Chart, registerables } from 'chart.js';
import { AsideComponent } from '../aside/aside.component';

@Component({
  selector: 'app-statistics',
  standalone: true,  // Không sử dụng Module
  imports: [CommonModule, HttpClientModule, AsideComponent],  // Import các module cần thiết
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  totalRevenue: number | null = null;
  completedOrders: number | null = null;
  pendingOrders: number | null = null;
  shippingOrders: number | null = null;
  canceledOrders: number | null = null;
  totalRemainingStock: number | null = null;
  dailyRevenues: DailyRevenueDTO[] = [];
  monthlyRevenues: MonthlyRevenueDTO[] = [];
  topProducts: any[] = [];  // Khai báo mảng chứa dữ liệu top sản phẩm

  dailyChart: any;  // Đối tượng biểu đồ hàng ngày
  monthlyChart: any;  // Đối tượng biểu đồ hàng tháng

  constructor(private statisticsService: StatisticsService) {
    Chart.register(...registerables);  // Đăng ký biểu đồ
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics() {
    this.statisticsService.getTotalRevenue().subscribe((data) => {
      this.totalRevenue = data;
    });

    this.statisticsService.getCompletedOrders().subscribe((data) => {
      this.completedOrders = data;
    });

    this.statisticsService.getPendingOrders().subscribe((data) => {
      this.pendingOrders = data;
    });

    this.statisticsService.getShippingOrders().subscribe((data) => {
      this.shippingOrders = data;
    });

    this.statisticsService.getCanceledOrders().subscribe((data) => {
      this.canceledOrders = data;
    });

    this.statisticsService.getTotalRemainingStock().subscribe((data) => {
      this.totalRemainingStock = data;
    });

    this.statisticsService.getDailyRevenues().subscribe((data) => {
      this.dailyRevenues = data;
      this.createDailyChart();  // Cập nhật biểu đồ với dữ liệu thực
    });

    this.statisticsService.getMonthlyRevenues().subscribe((data) => {
      this.monthlyRevenues = data;
      this.createMonthlyChart();  // Cập nhật biểu đồ với dữ liệu thực
    });

    this.statisticsService.getTopProducts().subscribe((data) => {
      this.topProducts = data;  // Lưu dữ liệu vào biến topProducts
    });
  }

  createDailyChart() {
    const labels = this.dailyRevenues.map(revenue => revenue.day);  // Sửa 'date' thành 'day'
    const data = this.dailyRevenues.map(revenue => revenue.totalRevenue);  // Sửa 'amount' thành 'totalRevenue'

    if (this.dailyChart) {
      this.dailyChart.destroy();  // Xóa biểu đồ cũ nếu tồn tại
    }

    this.dailyChart = new Chart('revenueDayChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Doanh thu hàng ngày',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Ngày',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Doanh thu (VND)',
            },
          }
        }
      }
    });
  }

  createMonthlyChart() {
    const labels = this.monthlyRevenues.map(revenue => revenue.month);
    const data = this.monthlyRevenues.map(revenue => revenue.totalRevenue);  // Sửa 'amount' thành 'totalRevenue'

    if (this.monthlyChart) {
      this.monthlyChart.destroy();  // Xóa biểu đồ cũ nếu tồn tại
    }

    this.monthlyChart = new Chart('revenueMonthChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Doanh thu hàng tháng',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Tháng',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Doanh thu (VND)',
            },
          }
        }
      }
    });
  }
}
