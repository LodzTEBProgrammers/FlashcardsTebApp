import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import {RegisterUser} from "../models/register-user";
import {LoginUser} from "../models/login-user";
import {AccountUser} from "../models/account-user";

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

  public postLogin(loginUser: LoginUser) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/PostLogin`, loginUser);
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
