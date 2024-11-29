import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrlAccount;

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, null).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return throwError({ message: `Error: ${error.error.message}` });
    } else {
      // Server-side error
      if (error.status === 400 && error.error.errors) {
        // Return validation errors
        return throwError({ status: error.status, errors: error.error.errors });
      } else {
        return throwError({ status: error.status, message: `Error Code: ${error.status}\nMessage: ${error.message}` });
      }
    }
  }
}
