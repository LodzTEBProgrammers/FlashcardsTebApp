import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import { environment } from "../../environments/environment";
import {RegisterUser} from "../models/register-user";
import {LoginUser} from "../models/login-user";
import {AccountUser} from "../models/account-user";
import {AuthResponse} from "../interfaces/AuthResponse";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrlAccount;
  private tokenKey = 'token';

  users: AccountUser[] = [];



  constructor(private http: HttpClient) {
  }

  public postRegister(registerUser: RegisterUser) : Observable<any> {
    return this.http.post<RegisterUser>(`${this.apiUrl}/PostRegister`, registerUser);
  }

  public postLogin(loginUser: LoginUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/PostLogin`, loginUser).pipe(
      map(response => {
        response.isSuccess = !!response.token;

        if (response.isSuccess) {
          localStorage.setItem(this.tokenKey, response.token!);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          response.message

        } else {
          response.message
        }
        return response;
      })
    );
  }

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.sub, // Assuming 'sub' is the user ID
      fullName: decodedToken.name, // Use 'name' instead of 'personName'
      email: decodedToken.email,
    }
    return userDetail;
  }

  public getLogout() : Observable<string> {
    localStorage.removeItem(this.tokenKey);
    return this.http.get<string>(`${this.apiUrl}/GetLogout`);
  }

  public postGenerateNewToken() : Observable<any> {
    var token = localStorage["token"];
    var refreshToken = localStorage["refreshToken"];

    return this.http.post<any>(`${this.apiUrl}/GenerateNewAccessToken/generate-new-jwt-token`, {token: token, refreshToken});
  }

  isLoggedIn = ():boolean => {
    const token = this.getToken();
    if(!token) return false;

    return !this.isTokenExpired();
  }

  private isTokenExpired() {
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.getLogout();

    return isTokenExpired;
  }

  private getToken = () :string | null => localStorage.getItem(this.tokenKey) || '';

  public getUsers(): Observable<AccountUser[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', "Bearer nicolaToken");

    return this.http.get<AccountUser[]>(`${this.apiUrl}/GetUsers`, { headers: headers });
  }
}
