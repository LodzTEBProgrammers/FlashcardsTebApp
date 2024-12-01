export interface AuthResponse {
  personName: string | null;
  email: string | null;
  token: string | null;
  expiration: string | null;
  refreshToken: string | null;
  refreshTokenExpirationDateTime: string | null;
  isSuccess: boolean;
  message: string;
}
