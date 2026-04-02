import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_PAYMENT_URL = `${environment.apiUrl}/payments`;

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  constructor(private http: HttpClient) {}

  createPayment(data: any): Observable<any> {
    return this.http.post(`${API_PAYMENT_URL}`, data, { withCredentials: true });
  }

  getPayments(params?: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    return this.http.get(`${API_PAYMENT_URL}`, {
      params: httpParams,
      withCredentials: true
    });
  }

  getPaymentStatus(orderCode: string): Observable<any> {
    return this.http.get(`${API_PAYMENT_URL}/status/${orderCode}`, {
      withCredentials: true
    });
  }

  getSubscription(): Observable<any> {
    return this.http.get(`${API_PAYMENT_URL}/subscription`, {
      withCredentials: true
    });
  }

  getPlans(): Observable<any> {
    return this.http.get(`${API_PAYMENT_URL}/plans`, {
      withCredentials: true
    });
  }

  getPaymentStream(orderCode: string): Observable<any> {
    return new Observable(observer => {
      const url = `${API_PAYMENT_URL}/stream/${orderCode}`;
      const eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onmessage = event => {
        // EventSource.onmessage event.data already contains the string from the 'data:' field.
        // Backend sends { data: { status: 'PAID' } }
        // So, event.data will be: "{ \"status\": \"PAID\" }"
        let parsedData;
        try {
          parsedData = JSON.parse(event.data);
        } catch (e) {
          console.error('Failed to parse SSE message data:', e, event.data);
          observer.error(new Error('Invalid SSE message format'));
          eventSource.close();
          return;
        }

        console.log('Received SSE message:', parsedData);
        if (parsedData.error) {
          observer.error(new Error(parsedData.error));
          eventSource.close();
        }

        observer.next(parsedData);

        // Nếu backend hoàn thành stream sau khi gửi trạng thái PAID,
        // thì frontend cũng nên hoàn thành và đóng kết nối.
        // Kiểm tra parsedData.status vì backend gửi { status: 'PAID' }
        if (parsedData.status === 'PAID') {
          eventSource.close();
          observer.complete();
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        observer.error(new Error('SSE connection failed'));
      };

      // Khi subscriber hủy đăng ký, đóng kết nối
      return () => eventSource.close();
    });
  }
}