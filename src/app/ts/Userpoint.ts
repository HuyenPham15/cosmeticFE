// user-point.model.ts
export interface UserPoint {
    pointID: string;      // ID của điểm
    userID: string;       // ID của người dùng
    point: number;        // Số điểm
    created_at: Date;     // Ngày tạo điểm
}