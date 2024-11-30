import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import { environment } from "../../environments/environment";
import {RegisterUser} from "../models/register-user";
import {LoginUser} from "../models/login-user";
import {AccountUser} from "../models/account-user";
import {AuthResponse} from "../interfaces/AuthResponse";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrlAccount;

  users: AccountUser[] = [];

  public currentEmail: string | null = null;


  constructor(private http: HttpClient) {}

  public postRegister(registerUser: RegisterUser) : Observable<any> {
    return this.http.post<RegisterUser>(`${this.apiUrl}/PostRegister`, registerUser);
  }

  public postLogin(loginUser: LoginUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/PostLogin`, loginUser).pipe(
      map(response => {
        // Derive isSuccess based on the presence of the token
        response.isSuccess = !!response.token;

        if (response.isSuccess) {
          localStorage.setItem('token', response.token!); // Use non-null assertion
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          response.message = "Login Success";
        } else {
          response.message = "Login Failed";
        }
        console.log(`isSuccess: ${response.isSuccess}, message: ${response.message}, token: ${response.token}`);
        return response;
      })
    );
  }

  public getLogout() : Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/GetLogout`);
  }

  public postGenerateNewToken() : Observable<any> {
    var token = localStorage["token"];
    var refreshToken = localStorage["refreshToken"];

    return this.http.post<any>(`${this.apiUrl}/GenerateNewAccessToken/generate-new-jwt-token`, {token: token, refreshToken});
  }

  public getUsers() : Observable<AccountUser[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', "Bearer nicolaToken");

    return this.http.get<AccountUser[]>(`${this.apiUrl}/GetUsers`, {headers: headers});
  }
}
