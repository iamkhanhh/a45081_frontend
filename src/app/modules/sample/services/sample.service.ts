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

  deleteFiles(ids: number[]): Observable<any>  {
    return this.http.delete(`${API_SAMPLE_URL}`, { withCredentials: true, body: {ids} });
  }

  public generateRandomString(len: number) {
		let result = '';
		let characters = '0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < len; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}
