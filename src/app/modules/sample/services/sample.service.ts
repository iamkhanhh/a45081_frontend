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

  startMultipartUpload(fileName: string): Observable<any>  {
    let formValue = {
      fileName
    }
    return this.http.post(`${API_SAMPLE_URL}/startMultipartUpload`, formValue, { withCredentials: true });
  }

  generatePresignedUrls(fileName: string, uploadId: string, partNumbers: number): Observable<any>  {
    let formValue = {
      fileName,
      uploadId,
      partNumbers
    }
    return this.http.post(`${API_SAMPLE_URL}/generatePresignedUrls`, formValue, { withCredentials: true });
  }

  completeMultipartUpload(fileName: string, uploadId: string, parts: any): Observable<any>  {
    let formValue = {
      fileName,
      uploadId,
      parts
    }
    return this.http.post(`${API_SAMPLE_URL}/completeMultipartUpload`, formValue, { withCredentials: true });
  }

  uploadSingleFile(url: string, file: Blob): Observable<any>  {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.put(url, file, {
      headers: new HttpHeaders({
        // 'Content-Type': 'text/vcard',
        'Access-Control-Expose-Headers': 'etag'
      }),
      reportProgress: true,
      observe: 'events'
    });
  }

  postFileInfor(data: any) {
    return this.http.post(`${API_SAMPLE_URL}/postFileInfor`, data ,{ withCredentials: true });
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
