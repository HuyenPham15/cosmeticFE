import { Subcategory } from '../subcategory/subcategory';  // Đổi 'SubCategory' thành 'Subcategory'

export class Category {
    categoryID: number;       
    categoryName: string;    
    subcategoryList: Subcategory[]; // Danh sách các danh mục con

    constructor(
        categoryID: number = 0,
        categoryName: string = '',
        subcategoryList: Subcategory[] = [] 
    ) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.subcategoryList = subcategoryList;
    }
}
