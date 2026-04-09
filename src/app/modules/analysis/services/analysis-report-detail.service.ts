import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { PricingService } from 'src/app/pages/pricing/pricing.service';

// Define interfaces for clarity and type safety
export interface ReportModel {
  id: number;
  name: string;
  analysisId: number;
  createdAt: string;
  // Add other properties as needed based on your actual API response for a report
  [key: string]: any; // Allow for additional properties not explicitly defined
}

export interface VariantPayload {
  id: string;
  gene: string;
  transcript: string;
  cdna: string;
  coverage: string;
  gad: string;
  classification: string;
}

export interface ReferencePayload {
  id: string;
  date: string;
  source: string;
  title: string;
  authors: string[];
}

export interface CreateReportPayload {
  report_name: string;
  analysisId: number;
  variants: VariantPayload[];
  references: ReferencePayload[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AnalysisReportDetailService implements OnDestroy {
  private apiUrl = `${environment.apiUrl}/report`; // Base URL for report APIs

  // Private fields for managing state
  private subscriptions: Subscription[] = [];
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private reportsSubject = new BehaviorSubject<ReportModel[] | undefined>(undefined);
  private currentReportSubject = new BehaviorSubject<ReportModel | undefined>(undefined);

  // Public observables to expose state
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  reports$: Observable<ReportModel[] | undefined> = this.reportsSubject.asObservable();
  currentReport$: Observable<ReportModel | undefined> = this.currentReportSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private pricingService: PricingService
  ) { }

  /**
   * Fetches all reports associated with a specific analysis ID.
   * @param analysisId The ID of the analysis to get reports for.
   * @returns An Observable of an array of ReportModel or undefined on error.
   */
  getAllReports(analysisId: number): Observable<ReportModel[] | undefined> {
    this.isLoadingSubject.next(true);
    const url = `${this.apiUrl}?analysis_id=${analysisId}`;
    const sub = this.http.get<ApiResponse<ReportModel[]>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (response.status === 'success') {
          this.reportsSubject.next(response.data);
          return response.data;
        } else {
          this.toastr.error(response.message, 'Error');
          return undefined;
        }
      }),
      catchError(err => {
        console.error('Error fetching all reports:', err);
        this.toastr.error(err.error?.message || 'Failed to fetch reports.', 'Error');
        if (err.status === 403) {
          this.pricingService.fetchCurrentPlan().subscribe({
            next: () => {
              window.location.reload();
            },
            error: (planErr) => {
              console.error('Lỗi khi cập nhật gói cước:', planErr);
            }
          });
        }

        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    ).subscribe();
    this.subscriptions.push(sub);
    return this.reports$;
  }

  /**
   * Fetches a single report by its ID.
   * @param reportId The ID of the report to fetch.
   * @returns An Observable of a ReportModel or undefined on error.
   */
  getReportById(reportId: number): Observable<ReportModel | undefined> {
    this.isLoadingSubject.next(true);
    const url = `${this.apiUrl}/${reportId}`;
    const sub = this.http.get<ApiResponse<ReportModel>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (response.status === 'success') {
          this.currentReportSubject.next(response.data);
          return response.data;
        } else {
          this.toastr.error(response.message, 'Error');
          return undefined;
        }
      }),
      catchError(err => {
        console.error(`Error fetching report with ID ${reportId}:`, err);
        this.toastr.error(err.error?.message || 'Failed to fetch report.', 'Error');
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    ).subscribe();
    this.subscriptions.push(sub);
    return this.currentReport$;
  }

  /**
   * Creates a new report.
   * @param payload The data for the new report.
   * @returns An Observable of the created ReportModel or undefined on error.
   */
  createReport(payload: CreateReportPayload): Observable<ReportModel | undefined> {
    this.isLoadingSubject.next(true);
    const url = this.apiUrl; // POST to base URL to create
    return this.http.post<ApiResponse<ReportModel>>(url, payload, { withCredentials: true }).pipe(
      map(response => {
        if (response.status === 'success') {
          this.toastr.success(response.message, 'Success');

          return response.data;
        } else {
          this.toastr.error(response.message, 'Error');
          return undefined;
        }
      }),
      catchError(err => {
        console.error('Error creating report:', err);
        this.toastr.error(err.error?.message || 'Failed to create report.', 'Error');
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Deletes a report by its ID.
   * @param reportId The ID of the report to delete.
   * @returns An Observable indicating success or failure.
   */
  deleteReport(reportId: number): Observable<boolean> {
    this.isLoadingSubject.next(true);
    const url = `${this.apiUrl}/${reportId}`;
    return this.http.delete<ApiResponse<any>>(url, { withCredentials: true }).pipe(
      map(response => {
        if (response.status === 'success') {
          this.toastr.success(response.message || 'Report deleted successfully', 'Success');
          return true;
        } else {
          this.toastr.error(response.message, 'Error');
          return false;
        }
      }),
      catchError(err => {
        console.error(`Error deleting report with ID ${reportId}:`, err);
        this.toastr.error(err.error?.message || 'Failed to delete report.', 'Error');
        return of(false);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Search PubMed by PMID
   * @param pmid The PubMed ID to search
   * @returns An Observable of the search result
   */
  searchPubmed(pmid: string): Observable<any> {
    this.isLoadingSubject.next(true);
    const url = `${environment.apiUrl}/search/references?pmid=${pmid}`;
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => {
        if (response && response.status === 'success') {
          return response.data;
        }
        return response; // Fallback if API doesn't use the standard ApiResponse wrapper
      }),
      catchError(err => {
        console.error(`Error fetching PubMed data for PMID ${pmid}:`, err);
        this.toastr.error(err.error?.message || 'Failed to fetch PubMed data.', 'Error');
        return of(null);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}