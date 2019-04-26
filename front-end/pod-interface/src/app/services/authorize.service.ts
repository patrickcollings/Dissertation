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
    private jwtHelper: JwtHelperService
  ) { }

  /**
   * Attempt to login.
   * @param username the entered username
   * @param password the entered password
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{token: string}>('http://localhost:3000/api/auth', {username, password})
      .pipe(
        map(result => {
          // Save the returned JWT to local storage.
          localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  // Logout the user.
  logout() {
    // Remove JWT from local storage.
    localStorage.removeItem('access_token');
  }

  // Get an auth code from the auth service when a user accepts a request.
  getCode(redirect: string, clientId: string, scope: string) {
    // Get JWT
    const token = localStorage.getItem('access_token');
    // Pass JWT and client credentials to auth service.
    return this.http.post<{code: string}>('http://localhost:3000/code', {redirect, clientId, token, scope})
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  // Remove authorisation of a client
  removeApp(client: string) {
    // Get JWT
    const token = localStorage.getItem('access_token');
    // Add JWT to header
    const headers = new HttpHeaders().append('Authorization', token);
    // HTTP DELETE request to auth service passing client in the URL.
    return this.http.delete('http://localhost:3000/authorized/' + client, {headers})
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  // Request the fitness app be authorised.
  addFitnessApp() {
    return this.http.get('http://localhost:3000/authfitness');
  }

  // Helper function used by the auth guard. Every time the route changes the JWT is checked to ensure it is still valid.
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    // Check whether the token is expired and return true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  // Check if a JWT is already stored on the website.
  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
