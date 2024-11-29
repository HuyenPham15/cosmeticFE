import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailService } from './detail.service';
import { Detail } from './detail';
import { CommonModule } from '@angular/common';
import { Productsize } from '../producsize/productsize';


@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    product: Detail | null = null; // Biến để lưu thông tin sản phẩm
    error: string | null = null; // Biến để lưu thông tin lỗi
    quantity: number = 1; // Biến để lưu số lượng sản phẩm được chọn
    currentImage: string | null = null; // Biến để lưu hình ảnh hiện tại
    images: string[] = [];  // Danh sách hình ảnh sau khi xử lý
    comments: any[] = [];  // Thêm biến lưu trữ danh sách nhận xét

    constructor(
        private route: ActivatedRoute,  // Để lấy thông tin từ URL
        private detailService: DetailService // Dịch vụ để lấy thông tin sản phẩm
    ) { }

    ngOnInit(): void {
        const productID = this.route.snapshot.paramMap.get('productID'); // Lấy ID từ URL
        const orderID = this.route.snapshot.paramMap.get('orderID'); // Lấy orderID từ URL
        if (productID) {
            // Gọi dịch vụ để lấy thông tin sản phẩm dựa trên productID
            this.detailService.getProductID(productID).subscribe({
                next: (data) => {
                    this.product = data; // Lưu thông tin sản phẩm
                    this.processImages(); // Xử lý hình ảnh
                    this.setImage(); // Thiết lập hình ảnh chính
                    console.log('Product data:', data);

                },
                error: (err) => {
                    this.error = 'Không thể tải thông tin sản phẩm';
                    console.error(err);
                }
            });
        } else {
            this.error = 'ID sản phẩm không hợp lệ';
        }
        // Gọi hàm lấy nhận xét nếu orderID hợp lệ
    if (orderID) {
        this.getCommentsForOrder(orderID);
    } else {
        console.warn('Không tìm thấy orderID');
    }
    }

    // Hàm xử lý danh sách ảnh tương tự như trong EditComponent
    processImages(): void {
        if (typeof this.product?.images === 'string') {
            this.images = this.product.images.split(',')
                .map(imageName => imageName.trim())
                .filter(imageName => imageName) // Lọc bỏ các chuỗi rỗng
                .map(imageName => this.formatImagePath(imageName)); // Định dạng lại đường dẫn
        } else if (Array.isArray(this.product?.images)) {
            this.images = this.product.images.flatMap(imageName =>
                typeof imageName === 'string' ? imageName.split(',') : []
            ).map(imageName => imageName.trim())
                .filter(imageName => imageName) // Lọc bỏ các chuỗi rỗng
                .map(imageName => this.formatImagePath(imageName)); // Định dạng lại đường dẫn
        } else {
            this.images = [];
        }
    }

    private formatImagePath(imageName: string): string {
        // Kiểm tra xem đường dẫn đã có sẵn tiền tố 'assets/upload/' chưa
        if (imageName.startsWith('assets/upload/')) {
            return imageName; // Nếu đã có, trả về nguyên dạng
        }
        return `assets/upload/${imageName}`; // Thêm đường dẫn assets/upload nếu chưa có
    }

    // Đặt hình ảnh đầu tiên từ danh sách hình ảnh``````
    setImage(): void {
        if (this.images && this.images.length > 0) {
            this.currentImage = this.images[0]; // Lấy ảnh đầu tiên trong danh sách sau khi xử lý
        }
    }

    // Thay đổi hình ảnh chính khi người dùng chọn thumbnail
    // Hàm để thay đổi hình ảnh, nhưng cung cấp giá trị mặc định nếu không có hình ảnh
    changeImage(image: string | null): void {
        const mainImage = document.getElementById('main-image');
        
        if (mainImage) {
            // Loại bỏ lớp fade-in hiện tại để bắt đầu quá trình chuyển ảnh mới
            mainImage.classList.remove('fade-in-active');
    
            // Đặt độ trễ ngắn để chờ lớp fade-in hoàn toàn bị loại bỏ trước khi đổi ảnh
            setTimeout(() => {
                // Cập nhật hình ảnh chính, sử dụng ảnh mặc định nếu không có ảnh
                this.currentImage = image || 'assets/upload/default-image.jpg';
                
                // Thêm lại lớp fade-in để kích hoạt hiệu ứng mờ dần
                mainImage.classList.add('fade-in-active');
            }, 100); // Độ trễ 100ms giúp tạo cảm giác chuyển ảnh mềm mại
        }
    }
    

    // Phương thức để thêm vào giỏ hàng
    addToCart(): void {
        if (this.product) {
            console.log(`Thêm ${this.quantity} sản phẩm ${this.product.productName} vào giỏ hàng`);
            // Xử lý thêm vào giỏ hàng ở đây
        }
    }
    // Phương thức lấy đường dẫn ảnh để hiển thị
    getImageSrc(imageName: string): string {
        return this.formatImagePath(imageName); // Sử dụng hàm formatImagePath


    }
    getCommentsForOrder(orderId: string): void {
        this.detailService.getCommentsByOrderId(orderId).subscribe({
            next: (data) => {
                this.comments = data; // Gán nhận xét vào biến comments
                console.log('Comments for order:', this.comments);
            },
            error: (err) => {
                console.error('Lỗi khi lấy nhận xét:', err);
            }
        });
    }
    
}
