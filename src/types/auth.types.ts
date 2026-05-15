export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;         // ISO string
  district: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export interface ForgotPasswordPayload {
  emailOrPhone: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
