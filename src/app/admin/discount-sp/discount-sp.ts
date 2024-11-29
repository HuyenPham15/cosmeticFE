export class Discount_sp {
    discountsp_id: string;
    discount_sp: number;
    start_date: Date;
    end_date: Date;
    status: boolean;

    constructor(
        discountsp_id: string = '',
        discount_sp: number = 0,
        start_date: Date = new Date(),
        end_date: Date = new Date(),
        status: boolean = true,
    ) {
        this.discountsp_id = discountsp_id;
        this.discount_sp = discount_sp;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
    }
}
