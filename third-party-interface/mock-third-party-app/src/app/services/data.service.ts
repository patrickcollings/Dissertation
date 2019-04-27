import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  // Get a key-value pair from pod.
  getHealthData(token: string, key) {
    const headers = new HttpHeaders({
      Authorization: token
    });
    return this.http.get('http://localhost:3002/health/' + key, {headers});
  }

  // Add or update key-value pair from the pod.
  addHealthData(token: string, key: string, value: any) {
    const headers = new HttpHeaders({
      Authorization: token
    });
    // Pass the value in the body of the request.
    const body = {
      [key]: value
    };
    return this.http.post('http://localhost:3002/health', body, {headers});
  }

  // Delete a key-value pair.
  deleteHealthData(token: string, key: string) {
    const headers = new HttpHeaders({
      Authorization: token
    });

    return this.http.delete('http://localhost:3002/health/' + key, {headers});
  }
}
