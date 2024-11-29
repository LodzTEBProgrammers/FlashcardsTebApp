import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import {RegisterUser} from "../models/register-user";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrlAccount;

  constructor(private http: HttpClient) {}

  public postRegister(registerUser: RegisterUser) : Observable<RegisterUser> {
    return this.http.post<RegisterUser>(`${this.apiUrl}/PostRegister`, registerUser);
  }
}
