import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import {RegisterUser} from "../models/register-user";
import {LoginUser} from "../models/login-user";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrlAccount;

  public currentUserName: string | null = null;


  constructor(private http: HttpClient) {}

  public postRegister(registerUser: RegisterUser) : Observable<RegisterUser> {
    return this.http.post<RegisterUser>(`${this.apiUrl}/PostRegister`, registerUser);
  }

  public postLogin(loginUser: LoginUser) : Observable<LoginUser> {
    return this.http.post<LoginUser>(`${this.apiUrl}/PostLogin`, loginUser);
  }

  public getLogout() : Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/GetLogout`);
  }
}
