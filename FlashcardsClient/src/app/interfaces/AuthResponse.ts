export interface AuthResponse {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  isSuccess: boolean;
  message: string;
}
