import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../admin/product';
import { Brand } from '../brand/brand';
import { Subcategory } from '../subcategory/subcategory';
import { Skintype } from '../skin-type/skin-type';
import { Productsize } from '../producsize/productsize';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Reactive Forms
import { AsideComponent } from '../aside/aside.component';
import { AdminService } from '../admin/admin.service';
import { BrandService } from '../brand/brand.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { SkinTypeService } from '../skin-type/skin-type.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [AsideComponent, FormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup; // Khai báo productForm

  // Variables for storing data
  brands: Brand[] = [];
  subcategories: Subcategory[] = [];
  skintypes: Skintype[] = [];

  tempProductSizes: Productsize[] = [];



  // Variables for storing selected data
  selectedBrand: Brand | null = null;
  selectedSubcategory: Subcategory | null = null;
  selectedSkintype: Skintype | null = null;
  selectedImages: string[] = [];
  isSubmitted: boolean = false;


  // Product-related objects
  productsize: Productsize = new Productsize();
  product: Product = new Product();

  // Reference for file upload
  @ViewChild('imageUpload', { static: false }) imageUpload!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productService: AdminService,
    private brandService: BrandService,
    private subcategoryService: SubcategoryService,
    private skintypeService: SkinTypeService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      specifications: ['', Validators.required],
      ingredients: ['', Validators.required],
      benefits: ['', Validators.required],
      usage: ['', Validators.required],
      review: ['', Validators.required],
      brand: [null, Validators.required],
      subcategory: [null, Validators.required],
      sizes: this.fb.array([]),  // Mảng rỗng cho kích thước sản phẩm
      images: [[], Validators.required] // Mảng rỗng cho ảnh sản phẩm
    });
  }
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



  ngOnInit(): void {
    this.loadBrands();
    this.loadSubcategories();
    this.loadSkintypes();


  }

  // Method to trigger file upload input click
  uploadFile(): void {
    this.imageUpload.nativeElement.click();
  }

  // Method to preview images selected by the user
  previewImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages = []; // Xóa danh sách cũ

      const fileList: FileList = input.files;
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        this.selectedImages.push(file.name); // Lưu tên tệp vào mảng
      }

      console.log(this.selectedImages); // In ra danh sách tên ảnh (tùy chọn)
    } else {
      console.error('Không tìm thấy tập tin!');
    }
  }
  loadSubcategories(): void {
    this.subcategoryService.getSubcategory().subscribe(
      (subcategories) => {
        this.subcategories = subcategories;
        console.log('Subcategories loaded:', this.subcategories);
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
      }
    );
  }

  loadSkintypes(): void {
    this.skintypeService.getSkintype().subscribe(
      (skintypes) => {
        this.skintypes = skintypes;
        console.log('Skin types loaded:', this.skintypes);
      },
      (error) => {
        console.error('Error fetching skin types:', error);
      }
    );
  }

  onSubmit(): void {
    this.saveProduct();
  }

  onBrandChange(event: any): void {
    console.log('Selected Brand:', this.selectedBrand);
    if (this.selectedBrand && this.selectedBrand.brandId) {
      console.log('Selected Brand ID:', this.selectedBrand.brandId);
    } else {
      console.log('Brand ID is undefined');
    }
  }

  loadBrands(): void {
    this.brandService.getBrand().subscribe(
      (brands) => {
        this.brands = brands;
        console.log('Brands loaded:', this.brands);
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }

  // Method to save the product
  saveProduct(): void {
    this.isSubmitted = true;

    // Kiểm tra nếu chưa nhập đủ thông tin các trường cần thiết
    if (!this.product.productName) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }

    if (!this.product.description) {
      alert('Vui lòng nhập mô tả sản phẩm.');
      return;
    }

    if (!this.product.specifications) {
      alert('Vui lòng nhập xuất xứ sản phẩm.');
      return;
    }

    if (!this.product.ingredients) {
      alert('Vui lòng nhập thành phần sản phẩm.');
      return;
    }

    if (!this.product.benefits) {
      alert('Vui lòng nhập lợi ích của sản phẩm.');
      return;
    }

    if (!this.product.usage) {
      alert('Vui lòng nhập cách dùng sản phẩm.');
      return;
    }

    if (!this.product.review) {
      alert('Vui lòng nhập đánh giá sản phẩm.');
      return;
    }




    // Kiểm tra thương hiệu, danh mục, kích thước, và hình ảnh
    if (!this.selectedBrand || !this.selectedSubcategory || this.product.productSizes.length === 0 || this.selectedImages.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm, bao gồm chọn thương hiệu, danh mục, ít nhất 1 kích thước và 1 ảnh.');
      return;
    }

    const productDTO = {
      productName: this.product.productName,
      description: this.product.description,
      specifications: this.product.specifications,
      ingredients: this.product.ingredients,
      benefits: this.product.benefits,
      usage: this.product.usage,
      review: this.product.review,
      skinID: this.selectedSkintype ? this.selectedSkintype.skinID : null,
      brandID: this.selectedBrand ? this.selectedBrand.brandId : null,
      subcategoryID: this.selectedSubcategory ? this.selectedSubcategory.subcategoryID : null,
      sizes: this.product.productSizes,  // Truyền toàn bộ mảng sizes
      images: this.selectedImages
    };

    this.productService.createProduct(productDTO).subscribe({
      next: (response: any) => {
        alert('Sản phẩm đã được tạo thành công!');
        this.router.navigate(['/product']);
      },
      error: (error) => {
        console.error('Đã xảy ra lỗi:', error.error);
        alert('Đã xảy ra lỗi. Vui lòng kiểm tra lại thông tin và thử lại.');
      }
    });
  }


  removeSize(index: number): void {
    // Xóa kích thước theo chỉ số trong mảng sizes
    if (index > -1) {
      this.product.productSizes.splice(index, 1);
    }
  }


  addSize(): void {
    if (!this.product.productSizes) {
      this.product.productSizes = []; // Khởi tạo mảng nếu chưa có
    }

    // Thêm kích thước mới vào product.productSizes
    this.product.productSizes.push({
      productSizeID: 0,
      quantity: 0,
      price: 0,
      variant: ''
    });
  }




}
