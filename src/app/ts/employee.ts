import { Authority } from "./authorities";
enum Gender {
    Male = 1,
    Female = 0
}

export class Employee {
    id?: number;
    lastName: string;
    firstName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    avatar: string;
    gender: Gender;
    total_point: number;
    addresses: string;
    authorities: Authority[];
    role: string;

    constructor(
        lastName: string = '',
        firstName: string = '',
        email: string = '',
        password?: string,
        phoneNumber?: string,
        avatar: string = '',
        gender: Gender = Gender.Male,
        total_point: number = 0,
        addresses: string = '',
        authorities: Authority[] = [],
        role: string = ''
    ) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.avatar = avatar;
        this.gender = gender;
        this.total_point = total_point;
        this.addresses = addresses;
        this.authorities = authorities;
        this.role = role;
    }

    // Optional: Method to validate email format
    validateEmail(): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(this.email);
    }

    // Optional: Method to validate phone number format
    validatePhoneNumber(): boolean {
        const phoneRegex = /^[0-9]{10,15}$/; // Simple validation for 10-15 digit phone numbers
        return phoneRegex.test(this.phoneNumber || '');
    }
}