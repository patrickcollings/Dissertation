import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PodService {

  constructor(
    private http: HttpClient
  ) { }

  getAuthorizedApps() {
    return this.http.get('http://localhost:3000/authorized');
  }
}
