import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VariantListService {

    API_URL = `${environment.apiUrl}/variant`;

    constructor(private http: HttpClient) { }

    loadVariants(page: number, pageSize: number, data: any) {
        return this.http.post(`${this.API_URL}?page=${page}&pageSize=${pageSize}`, data, { withCredentials: true });
    }
}
