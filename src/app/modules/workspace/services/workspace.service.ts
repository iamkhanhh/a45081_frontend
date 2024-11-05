import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';

const API_WORKSPACE_URL = `${environment.apiUrl}/workspaces`;

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(private http: HttpClient) {}

  loadWorkspaces(page: number, pageSize: number): Observable<any> {
		return this.http.get(`${API_WORKSPACE_URL}?page=${page}&pageSize=${pageSize}`, { withCredentials: true });
	}

  loadAnalyses(workspace_id: number, page: number, pageSize: number): Observable<any> {
		return this.http.get(`${environment.apiUrl}/analysis/getAnalysesByWorkspaceId/${workspace_id}?page=${page}&pageSize=${pageSize}`, { withCredentials: true });
	}

  getWorkspaceName(workspace_id: number): Observable<any> {
		return this.http.get(`${API_WORKSPACE_URL}/getWorkspaceName/${workspace_id}`, { withCredentials: true });
	}

	getListPipeline(): Observable<any> {
		return this.http.get(`${environment.apiUrl}/pipelines`, { withCredentials: true });
	}

  getWorkspaceById(workspace_id: number): Observable<any> {
		return this.http.get(`${API_WORKSPACE_URL}/${workspace_id}`, { withCredentials: true });
	}

	deleteWorkspace(workspace_id: number): Observable<any> {
		return this.http.delete(`${API_WORKSPACE_URL}/${workspace_id}`, { withCredentials: true });
	}

	create(data: any): Observable<any> {
		return this.http.post(`${API_WORKSPACE_URL}`, data ,{ withCredentials: true });
	}

	edit(id: number, data: any): Observable<any> {
		return this.http.put(`${API_WORKSPACE_URL}/${id}`, data ,{ withCredentials: true });
	}
}