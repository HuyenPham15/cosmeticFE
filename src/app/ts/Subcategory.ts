import { Category } from "./Category";

export class Subcategory {
    subcategoryID: number;         // ID danh mục con
    subcategoryName: string;       // Tên danh mục con
    category: Category;            // Thông tin danh mục chính

    constructor(
        subcategoryID: number = 0,
        subcategoryName: string = '',
        category: Category = new Category()  // Mặc định là đối tượng trống
    ) {
        this.subcategoryID = subcategoryID;
        this.subcategoryName = subcategoryName;
        this.category = category;  // Gán đúng với thuộc tính category
    }
}
