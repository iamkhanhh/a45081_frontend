import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';

const API_AUTH_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_AUTH_URL}/login`, {
      email,
      password,
    }, {withCredentials: true});
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${API_AUTH_URL}/register`, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${API_AUTH_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(): Observable<any> {
    return this.http.get<any>(`${API_AUTH_URL}/me`, {
      withCredentials: true
    });
  }

  activateAccount(code: string, user_id: number): Observable<any> {
    return this.http.post(`${API_AUTH_URL}/activate-account/${user_id}`, {
      code,
    });
  }

  logout(): Observable<any> {
		return this.http.post(`${API_AUTH_URL}/logout`, {}, { withCredentials: true });
	}
}
