import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {}

  public listCompanies() {
    return this.http.get(`${this.baseUrl}/companies`);
  }

  public getCompanyById(id: string) {
    return this.http.get(`${this.baseUrl}/companies/${id}`);
  }
}
