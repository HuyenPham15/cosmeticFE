import { Address } from "../ts/Address";
import { Authority } from "./authorities";

enum Gender {
    Male = 1,
    Female = 0
}
export class Users {
    id?: number;
    lastName: string;
    firstName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    avatar: string;
    gender: Gender;
    total_point: number;
    addresses: Address[];
    authorities: Authority[];
    role: string

    constructor(
        lastName: string = '',
        firstName: string = '',
        email: string = '',
        password?: string,
        phoneNumber?: string,
        avatar: string = '',
        gender: Gender = Gender.Male,
        total_point: number = 0,
        addresses: Address[] = [],
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
        this.role = role
    }

}
