import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, DashboardData } from './dashboard.service';

const API_DASHBOARD_URL = 'http://localhost:3000/account/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardHTTPService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(API_DASHBOARD_URL, { withCredentials: true });
  }
}