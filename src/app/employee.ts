export class Employee{
    userID: string;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    phoneNumber: string;
    avatar: string;
    gender: boolean;
    total_point: number;

    constructor(
        userID: string = '',
        lastName: string = '',
        firstName: string = '',
        email: string = '',
        password: string = '',
        phoneNumber: string = '',
        avatar: string = '',
        gender: boolean = true, // Giới tính mặc định là true (nam)
        total_point: number = 0 // Tổng điểm mặc định là 0
    ) {
        this.userID = userID;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.avatar = avatar;
        this.gender = gender;
        this.total_point = total_point;
    }
}