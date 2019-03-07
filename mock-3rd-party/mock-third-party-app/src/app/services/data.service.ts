import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  getHealthData(token: string, key) {
    const headers = new HttpHeaders({
      Authorization: token
    });
    return this.http.get('http://localhost:3002/health/' + key, {headers});
  }

  addHealthData(token: string, key: string, value: any) {
    const headers = new HttpHeaders({
      Authorization: token
    });
    const body = {
      [key]: value
    };

    return this.http.post('http://localhost:3002/health', body, {headers});
  }

  deleteHealthData(token: string, key: string) {
    const headers = new HttpHeaders({
      Authorization: token
    });

    return this.http.delete('http://localhost:3002/health/' + key, {headers});
  }
}
