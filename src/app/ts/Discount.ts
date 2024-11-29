export interface Discount {
    discountId: string;
    discountCode: string;
    description: string;
    discountType: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    maxUsage: number;
    usageCount: number;
}
