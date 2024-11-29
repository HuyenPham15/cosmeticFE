
export class Brand {
    brandId: number;
    brandName: string;
    brandImage: string
    constructor(
        brandId: number = 0,
        brandName: string = '',
        brandImage: string = '',
    ) {
        this.brandId = brandId;
        this.brandName = brandName;
        this.brandImage = brandImage;
    }
}
