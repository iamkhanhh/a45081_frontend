import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DashboardHTTPService } from './dashboard-http.service';

// Định nghĩa các interface để làm việc với dữ liệu API một cách an toàn và rõ ràng
export interface RecentAnalysis {
  id: number;
  name: string;
  workspaceName: string;
  createdAt: string;
  analyzed: string;
  variants: number | null;
  assembly: string;
  status: string;
}

export interface DashboardData {
  workspaces: number;
  analyses: number;
  samples: number;
  analysisByStatus: { [key: string]: number };
  samplesByFileType: { [key: string]: number };
  samplesbyAsembly: { [key: string]: number }; 
  samplesLastSixMonths: number[];
  analysisLastSixMonths: number[];
  lastSixMonths: string[];
  recentAnalyses: RecentAnalysis[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // private fields
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private dashboardDataSubject = new BehaviorSubject<DashboardData | null>(null);

  // public fields
  isLoading$: Observable<boolean>;
  dashboardData$: Observable<DashboardData | null>;

  constructor(
    private dashboardHttpService: DashboardHTTPService,
    private toastr: ToastrService
  ) {
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.dashboardData$ = this.dashboardDataSubject.asObservable();
  }

  // public methods
  fetchDashboardData(): Observable<DashboardData | undefined> {
    this.isLoadingSubject.next(true);
    return this.dashboardHttpService.getDashboardData().pipe(
      map((response: ApiResponse<DashboardData>) => {
        if (response.status === 'success') {
          this.dashboardDataSubject.next(response.data);
          return response.data;
        }
        this.toastr.warning(response.message, 'Warning');
        return undefined;
      }),
      catchError((err) => {
        this.toastr.error(err.error?.message || 'Failed to fetch dashboard data.', 'Error');
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}