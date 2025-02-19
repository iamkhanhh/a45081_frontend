import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_SAMPLE_URL = `${environment.apiUrl}/samples`;

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  constructor(private http: HttpClient) {}

  loadSamples(page: number, pageSize: number, formValue: any): Observable<any> {
    return this.http.post(`${API_SAMPLE_URL}/load-samples?page=${page}&pageSize=${pageSize}`, formValue ,{ withCredentials: true });
  }

  deleteFiles(ids: number[]): Observable<any>  {
    return this.http.delete(`${API_SAMPLE_URL}`, { withCredentials: true, body: {ids} });
  }

  generateSinglePresignedUrl(fileName: string): Observable<any>  {
    let formValue = {
      fileName
    }
    return this.http.post(`${API_SAMPLE_URL}/generateSinglePresignedUrl`, formValue, { withCredentials: true });
  }

  uploadSingleFile(url: string, file: File): Observable<any>  {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.put(url, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'text/vcard'
      }),
      reportProgress: true,
      observe: 'events'
    });
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
