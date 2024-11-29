
export class Brand {
    brandId: number;
    brandName: string;
    brandImages: string
    constructor(
        brandId: number = 0,
        brandName: string = '',
        brandImage: string = '',
    ) {
        this.brandId = brandId;
        this.brandName = brandName;
        this.brandImages = brandImage;
    }
}
