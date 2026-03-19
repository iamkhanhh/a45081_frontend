import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, DashboardData } from './dashboard.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardHTTPService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(environment.apiUrl + '/account/dashboard', { withCredentials: true });
  }
}