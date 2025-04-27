import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_ACCOUNT_URL = `${environment.apiUrl}/account`;

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {}

  account(): Observable<any> {
    return this.http.get(`${API_ACCOUNT_URL}`,{ withCredentials: true });
  }

  updatePassword(data: any): Observable<any> {
    return this.http.patch(`${API_ACCOUNT_URL}/update-password`, data, { withCredentials: true });
  }

  update(data: any): Observable<any> {
    return this.http.put(`${API_ACCOUNT_URL}`, data, { withCredentials: true });
  }
}
