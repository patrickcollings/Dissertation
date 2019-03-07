import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(
    private http: HttpClient
  ) { }

  getPermission(readPerm, writePerm, deletePerm) {
    // Randomly generate state string
    const state = uuid(8);
    localStorage.setItem('state', state);
    let scope = '';

    if (readPerm) {
      scope += 'health-read ';
    }
    if (writePerm) {
      scope += 'health-write ';
    }
    if (deletePerm) {
      scope += 'health-delete';
    }
    scope = scope.trim();
    const uri = encodeURI(`http://localhost:4444/auth?response_type=code&client_id=29352915982374239857&redirect_uri=http://localhost:4200/callback&scope=${scope}&state=${state}`);
    window.open(uri, '_self');
  }

  checkState(state): boolean {
    const oldState = localStorage.getItem('state');
    if (oldState === state) {
      return true;
    } else {
      return false;
    }
  }

  getAccessToken(code: string, scope: string): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>('http://localhost:3001/accesstoken', {code, scope});
  }
}
