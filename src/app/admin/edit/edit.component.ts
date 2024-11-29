import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../admin/product';
import { AdminService } from '../admin/admin.service';
import { CommonModule } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { Brand } from '../brand/brand';
import { Skintype } from '../skin-type/skin-type';
import { Subcategory } from '../subcategory/subcategory';
import { Productsize } from '../producsize/productsize';
import { log } from 'node:console';
import { BrandService } from '../brand/brand.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { SkinTypeService } from '../skin-type/skin-type.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideComponent],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  product: Product = new Product();
  productID!: string;

  brands: Brand[] = [];
  skintypes: Skintype[] = [];
  subcategories: Subcategory[] = [];
  productSizes: Productsize[] = [];  // Danh sách kích thước sản phẩm
  images: string[] = [];
  selectedBrand: Brand | undefined = undefined;
  selectedSubcategory: Subcategory | null = null;
  selectedSkintype: Skintype | null = null;
  deletedImages: string[] = [];
  selectedImages: string[] = [];
  selectedFileNames: string[] = [];
  updatedImages: string[] = [];



  productsize: Productsize = new Productsize();

  // Reference for file upload
  @ViewChild('imageUpload', { static: false }) imageUpload!: ElementRef;
  constructor(
    private productService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private brandService: BrandService,
    private subcategoryService: SubcategoryService,
    private skintypeService: SkinTypeService,
    private ngZone: NgZone
  ) { }
  //sang
  onBrandChange(event: any) {
    console.log('Selected Brand:', this.selectedBrand);  // Kiểm tra giá trị đã chọn
  }
  imagePreviews: string[] = []; // Mảng chứa các URL của ảnh thu nhỏ

  countries: string[] = [
    'Afghanistan',
    'Ai Cập',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua và Barbuda',
    'Argentina',
    'Armenia',
    'Áo',
    'Azerbaijan',
    'Ba Lan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Bỉ',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia và Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Các tiểu vương quốc Ả Rập Thống Nhất',
    'Campuchia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Chad',
    'Chile',
    'Colombia',
    'Comoros',
    'Congo',
    'Cộng hòa Séc',
    'Cộng hòa Dân chủ Congo',
    'Cộng hòa Trung Phi',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Đan Mạch',
    'Djibouti',
    'Dominica',
    'Dominican',
    'Đông Timor',
    'Ecuador',
    'El Salvador',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Fiji',
    'Gabon',
    'Gambia',
    'Georgia',
    'Ghana',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guinea Xích Đạo',
    'Guyana',
    'Hà Lan',
    'Hàn Quốc',
    'Hoa Kỳ',
    'Honduras',
    'Hungary',
    'Iceland',
    'Ấn Độ',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Lào',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mông Cổ',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Na Uy',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Phần Lan',
    'Pháp',
    'Qatar',
    'Romania',
    'Rwanda',
    'Saint Kitts và Nevis',
    'Saint Lucia',
    'Saint Vincent và Grenadines',
    'Samoa',
    'San Marino',
    'São Tomé và Príncipe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Síp',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Syria',
    'Tajikistan',
    'Tanzania',
    'Tây Ban Nha',
    'Thái Lan',
    'Thổ Nhĩ Kỳ',
    'Togo',
    'Tonga',
    'Trinidad và Tobago',
    'Tunisia',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican',
    'Venezuela',
    'Việt Nam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];


  loadBrands() {
    this.productService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        console.log('Brands:', this.brands);  // Kiểm tra dữ liệu trả về
      },
      error: (error) => {
        console.error('Error loading brands:', error);
      }
    });
  }



  //sang
  ngOnInit(): void {
    this.productID = this.route.snapshot.params['productID'];
    this.productService.getProductID(this.productID).subscribe({
      next: (data: Product) => {
        console.log('Product data:', data);
        this.product = data;

        // Xử lý hình ảnh
        if (typeof this.product.images === 'string') {
          this.images = this.product.images.split(',')
            .map(imageName => imageName.trim())
            .filter(imageName => imageName) // Lọc bỏ các chuỗi rỗng
            .map(imageName => this.formatImagePath(imageName)); // Sử dụng hàm formatImagePath
        } else if (Array.isArray(this.product.images)) {
          this.images = this.product.images.flatMap(imageName =>
            typeof imageName === 'string' ? imageName.split(',') : []
          ).map(imageName => imageName.trim())
            .filter(imageName => imageName) // Lọc bỏ các chuỗi rỗng
            .map(imageName => this.formatImagePath(imageName)); // Sử dụng hàm formatImagePath
        } else {
          this.images = [];
        }

        console.log('Processed Images:', this.images);
        this.getProductSizes(this.productID);
      },
      error: (err) => {
        console.log('Error loading product:', err);
      }
    });

    // Lấy danh sách thương hiệu, loại da, danh mục
    this.getBrands();
    this.getSkintypes();
    this.getSubcategories();
  }

  // Hàm định dạng đường dẫn hình ảnh
  private formatImagePath(imageName: string): string {
    // Nếu hình ảnh đã có tiền tố 'assets/upload/' thì không thêm nữa
    if (imageName.startsWith('assets/upload/')) {
      return imageName; // Trả về đường dẫn hiện tại
    }
    return `assets/upload/${imageName}`; // Thêm tiền tố nếu chưa có
  }



  getProductSizes(productID: string) {
    this.productService.getProductSizes(productID).subscribe({
      next: (data: Productsize[]) => { // Đổi thành Productsize[]
        this.productSizes = data; // Gán trực tiếp dữ liệu vào productSizes
        console.log('Product Sizes loaded:', this.productSizes);
      },
      error: (error) => {
        console.error('Error loading product sizes:', error);
      }
    });
  }

  getBrands() {
    this.productService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        console.log('brand', this.brands);
      },
      error: (error) => {
        console.error('Error fetching brands:', error);
      }
    });
  }

  getSkintypes() {
    this.productService.getSkinTypes().subscribe({
      next: (data) => {
        this.skintypes = data;
        console.log('Skintype', this.skintypes);

      },
      error: (error) => {
        console.error('Error fetching skin types:', error);
      }
    });
  }

  getSubcategories() {
    this.productService.getSubcategories().subscribe({
      next: (data) => {
        this.subcategories = data;
        console.log('Subcategories:', this.subcategories);
      },
      error: (error) => {
        console.error('Error fetching subcategories:', error);
      }
    });
  }



  updateProduct() {
    // Kiểm tra xem sản phẩm có tồn tại không
    if (!this.product || !this.productID) {
      console.error('Product or Product ID is undefined, cannot update.');
      alert('Sản phẩm không hợp lệ.');
      return;
    }

    // Kiểm tra tên sản phẩm
    if (!this.product.productName || this.product.productName.trim() === '') {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }

    // Kiểm tra mô tả sản phẩm
    if (!this.product.description || this.product.description.trim() === '') {
      alert('Vui lòng nhập mô tả sản phẩm.');
      return;
    }
    // Kiểm tra xuất xứ
    if (!this.product.specifications || this.product.specifications.length === 0) {
      alert('Vui lòng nhập xuất xứ.');
      return;
    }

    // Kiểm tra xuất xứ
    if (!this.product.ingredients || this.product.ingredients.length === 0) {
      alert('Vui lòng nhập thành phần.');
      return;
    }

    // Kiểm tra xuất xứ
    if (!this.product.benefits || this.product.benefits.length === 0) {
      alert('Vui lòng nhập lợi ích.');
      return;
    } 

    // Kiểm tra xuất xứ
    if (!this.product.usage || this.product.usage.length === 0) {
      alert('Vui lòng nhập cách dùng.');
      return;
    } 

    // Kiểm tra xuất xứ
    if (!this.product.review || this.product.review.length === 0) {
      alert('Vui lòng nhập review.');
      return;
    } 



    // Kiểm tra kích thước sản phẩm (phải có ít nhất một kích thước)
    if (!this.productSizes || this.productSizes.length === 0) {
      alert('Vui lòng thêm ít nhất một kích thước sản phẩm.');
      return;
    }

    // Kiểm tra danh sách ảnh sản phẩm hiện có và ảnh mới
    const currentImages = Array.isArray(this.product.images) ? this.product.images : [];
    const newImages = this.updatedImages || [];

    // Kiểm tra nếu không có ảnh hiện tại và không có ảnh mới
    if (currentImages.length === 0 && newImages.length === 0) {
      alert('Vui lòng thêm ít nhất một ảnh sản phẩm.');
      return;
    }

    // Xóa những hình ảnh đã bị người dùng xóa
    const updatedImages = this.images.filter((image: string) =>
      !this.deletedImages.includes(image) // Giả định có mảng deletedImages chứa các ảnh đã xóa
    );

    // Thêm ảnh mới chưa có trong danh sách hiện tại
    newImages.forEach((newImage: string) => {
      const trimmedNewImage = newImage.trim(); // Loại bỏ khoảng trắng
      if (!updatedImages.includes(trimmedNewImage)) {
        updatedImages.push(trimmedNewImage);
      }
    });

    // Chuẩn bị dữ liệu cho các kích thước sản phẩm
    const productSizes = this.productSizes.map(size => new Productsize(
      size.productSizeID, // Giữ nguyên ID nếu có
      size.quantity > 0 ? size.quantity : 0,  // Kiểm tra số lượng
      size.price > 0 ? size.price : 0,        // Kiểm tra giá
      size.variant || ''                      // Kiểm tra variant
    ));

    // Chuẩn bị dữ liệu cập nhật sản phẩm
    const productData = {
      ...this.product,
      productSizes,
      images: updatedImages // Danh sách ảnh cập nhật
    };

    console.log('Updating product with data:', productData);

    // Gửi yêu cầu cập nhật sản phẩm qua ProductService
    this.productService.updateProduct(this.productID, productData).subscribe({
      next: (data) => {
        console.log('Cập nhật thành công:', data);
        alert('Sản phẩm đã được cập nhật thành công!');
        this.goToProduct(); // Điều hướng tới trang chi tiết sản phẩm
      },
      error: (error) => {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        alert(error.error ? error.error : 'Đã xảy ra lỗi khi cập nhật sản phẩm.');
      }
    });
  }





  goToProduct() {
    this.router.navigate(['/product']);  // Adjust the route based on your navigation logic
  }

  onSubmit() {
    this.updateProduct(); // Gọi phương thức cập nhật sản phẩm
  }


  addSize(): void {
    // Kiểm tra nếu productSizes đã được khởi tạo
    if (!this.productSizes) {
      this.productSizes = []; // Khởi tạo mảng mới nếu cần
    }

    // Thêm kích thước mới vào mảng productSizes mà không làm thay đổi mảng gốc
    const newSize: Productsize = {
      productSizeID: 0, // Không có ID ban đầu
      quantity: 0,
      price: 0,
      variant: '', // Giữ giá trị variant trống cho size mới
    };

    this.productSizes.push(newSize); // Thêm trực tiếp vào mảng hiện có

    console.log('New size added:', newSize);
    console.log('Updated productSizes:', this.productSizes);
  }



  removeProductSize(index: number): void {
    if (index > -1) {
      const removedSize = this.productSizes.splice(index, 1);
      console.log('Product size removed:', removedSize);
    }
  }


  removeOldImage(index: number) {
    if (index > -1) {
      const removedImage = this.images[index]; // Lưu hình ảnh bị xóa
      this.images.splice(index, 1); // Xóa hình ảnh khỏi danh sách
      this.deletedImages.push(removedImage); // Thêm vào mảng deletedImages
    }
    console.log(this.images);
    console.log(`Đã xóa hình ảnh: ${index}`);
  }

  onImageSelected(event: any) {
    const files = event.target.files as FileList;
    const maxFileSizeMB = 1; // Dung lượng tối đa là 1MB
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024; // Đổi sang byte

    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        if (file.size > maxFileSizeBytes) {
          console.error(`File "${file.name}" vượt quá dung lượng cho phép (${maxFileSizeMB}MB).`);
          alert(`File "${file.name}" vượt quá dung lượng cho phép (${maxFileSizeMB}MB).`);
        } else {
          const fileName = file.name;
          // Kết hợp ảnh cũ và ảnh mới, đảm bảo không trùng lặp
          if (!this.updatedImages.includes(fileName)) {
            this.updatedImages.push(fileName);
          }
        }
      });
      console.log('Updated images list:', this.updatedImages);
    }
  }


  removeImage(image: string) {
    const index = this.updatedImages.indexOf(image);
    if (index > -1) {
      this.updatedImages.splice(index, 1); // Xóa ảnh khỏi danh sách
    }
    console.log(`Đã xóa ảnh: ${image}`);
  }



}
