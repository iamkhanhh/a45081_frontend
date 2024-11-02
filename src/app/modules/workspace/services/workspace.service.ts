import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_WORKSPACE_URL = `${environment.apiUrl}/workspaces`;

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(private http: HttpClient) {}

  loadWorkspaces(): Observable<any> {
		return this.http.get(`${API_WORKSPACE_URL}`, { withCredentials: true });
	}
}