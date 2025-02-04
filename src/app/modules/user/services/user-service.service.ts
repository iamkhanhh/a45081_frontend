import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_USER_URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  loadUsers(page: number, pageSize: number, formValue: any): Observable<any> {
    return this.http.post(`${API_USER_URL}/load-users?page=${page}&pageSize=${pageSize}`, formValue ,{ withCredentials: true });
  }
}
