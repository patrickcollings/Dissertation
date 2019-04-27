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

  // Builds the request URL for requesting access to the pod.
  getPermission(readPerm, writePerm, deletePerm) {
    // Randomly generate state string to be cross checked when returned.
    const state = uuid(8);
    // Add state in local storage.
    localStorage.setItem('state', state);
    let scope = '';
    // For each permission checked add to the scope string
    if (readPerm) {
      scope += 'health-read ';
    }
    if (writePerm) {
      scope += 'health-write ';
    }
    if (deletePerm) {
      scope += 'health-delete';
    }
    // Remove any empty spaces at the end of the string
    scope = scope.trim();
    // Create the request URL
    const uri = encodeURI(`http://localhost:4444/auth?response_type=code&client_id=29352915982374239857&redirect_uri=`
     + `http://localhost:4200/callback&scope=${scope}&state=${state}`);
    // Open the URL to send user to their pod.
    window.open(uri, '_self');
  }

  // Check if the state in the return URL matches the original
  checkState(state): boolean {
    const oldState = localStorage.getItem('state');
    if (oldState === state) {
      return true;
    } else {
      return false;
    }
  }

  // Get an access token for the user provided an auth code and scope.
  getAccessToken(code: string, scope: string): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>('http://localhost:3001/accesstoken', {code, scope});
  }
}
