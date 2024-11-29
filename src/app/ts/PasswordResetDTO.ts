// password-reset.dto.ts
export interface PasswordResetDTO {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }
  