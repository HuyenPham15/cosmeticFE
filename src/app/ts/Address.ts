export class Address {
    id: number;
    street: string;
    ward?: string | null;
    district: string;
    city: string;
    defaultAddress: boolean;
    specificAddress: string; // New property added

    constructor(
        id: number = 0, street: string = '',
        district: string = '',
        city: string = '',
        ward: string | null = null,
        defaultAddress: boolean = false,
        specificAddress: string = '' // Initialize specificAddress

    ) {
        this.id = id;
        this.street = street;
        this.ward = ward || null;
        this.district = district;
        this.city = city;
        this.defaultAddress = defaultAddress;
        this.specificAddress = specificAddress;
    }
}
