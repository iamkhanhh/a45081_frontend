import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VariantListService {

    constructor(private http: HttpClient) { }

    loadVariants(id: number, page: number, pageSize: number, data: any) {
        return this.http.post(`${environment.apiUrl}/variants/${id}?page=${page}&pageSize=${pageSize}`, data, { withCredentials: true });
    }

    loadVariantsSelected(id: number) {
        return this.http.get(`${environment.apiUrl}/variants/get-variants-selected/${id}`, { withCredentials: true });
    }

    selectVariantToReport(id: number, data: any) {
        return this.http.post(`${environment.apiUrl}/variants/add-to-report/${id}`, { variants: data }, { withCredentials: true });
    }

    createReport(id: number, data: any) {
        return this.http.post(`${environment.apiUrl}/variants/${id}/export-report`, data, { withCredentials: true });
    }
}
