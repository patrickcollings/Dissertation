import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PodService {

  constructor(
    private http: HttpClient
  ) { }

  // Get list of authorised apps from auth service.
  getAuthorizedApps() {
    return this.http.get('http://localhost:3000/authorized');
  }

  // Get all health data from pod database.
  getData() {
    return this.http.get('http://localhost:3002/health');
  }
}
