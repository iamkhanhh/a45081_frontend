import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_ANALYSIS_URL = `${environment.apiUrl}/analysis`;

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(private http: HttpClient) { }

  loadAnalyses(page: number, pageSize: number, formValue: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/analysis/load-analyses?page=${page}&pageSize=${pageSize}`, formValue, { withCredentials: true });
  }

  getAnalysis(id: number): Observable<any> {
    return this.http.get(`${API_ANALYSIS_URL}/${id}`, { withCredentials: true });
  }

  getQCVCF(id: number): Observable<any> {
    return this.http.get(`${API_ANALYSIS_URL}/get-qc-vcf/${id}`, { withCredentials: true });
  }
}
