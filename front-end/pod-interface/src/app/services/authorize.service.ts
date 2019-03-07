import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{token: string}>('http://localhost:3000/api/auth', {username, password})
      .pipe(
        map(result => {
          console.log(result);
          localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  logout() {
    console.log('Logging out');
    localStorage.removeItem('access_token');
  }

  getCode(redirect: string, clientId: string, scope: string) {
    // Get jwt token
    const token = localStorage.getItem('access_token');
    console.log('Making request');
    console.log(token);
    return this.http.post<{code: string}>('http://localhost:3000/code', {redirect, clientId, token, scope})
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  removeApp(client: string) {
    // Get jwt token
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().append('Authorization', token);

    return this.http.delete('http://localhost:3000/authorized/' + client, {headers})
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
