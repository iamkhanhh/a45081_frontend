import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_SAMPLE_URL = `${environment.apiUrl}/samples`;

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  constructor(private http: HttpClient) {}

  loadSamples(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${API_SAMPLE_URL}?page=${page}&pageSize=${pageSize}`, { withCredentials: true });
  }
}
