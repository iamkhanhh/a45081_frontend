import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API_PAYMENT_URL = `${environment.apiUrl}/payments`;

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private readonly CURRENT_PLAN_KEY = 'current_subscription_plan';
  private currentPlanSubject = new BehaviorSubject<any>(null);
  public currentPlan$ = this.currentPlanSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load current plan: check localStorage first, fallback to backend if not found.
   */
  loadCurrentPlan(): Observable<any> {
    const storedPlan = localStorage.getItem(this.CURRENT_PLAN_KEY);
    if (storedPlan) {
      try {
        const plan = JSON.parse(storedPlan);
        this.currentPlanSubject.next(plan);
        return of(plan);
      } catch (e) {
        console.error('Failed to parse stored plan', e);
        localStorage.removeItem(this.CURRENT_PLAN_KEY);
      }
    }
    // If no valid data in localStorage, fetch from backend
    return this.fetchCurrentPlan();
  }

  /**
   * Fetch from backend, update state/localStorage, and handle 401/403.
   */
  fetchCurrentPlan(): Observable<any> {
    return this.getSubscription().pipe(
      map((response: any) => {
        // Extract the actual plan from the nested structure (data.plan)
        const plan = response?.data?.plan || response?.data || response;
        
        // Attach the subscription details (like expiration) to the plan if needed by the frontend
        if (response?.data?.endDate) {
          plan.expirationDate = response.data.endDate;
          plan.subscriptionStartDate = response.data.startDate;
          plan.isSubscriptionActive = response.data.isActive;
        }
        console.log('Fetched current plan from backend:', plan);
        
        return plan;
      }),
      tap((plan) => {
        this.setCurrentPlan(plan);
      }),
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          console.warn('Unauthorized to fetch plan. Checking local storage as fallback.');
          const storedPlan = localStorage.getItem(this.CURRENT_PLAN_KEY);
          if (storedPlan) {
            try {
              const plan = JSON.parse(storedPlan);
              this.currentPlanSubject.next(plan);
              return of(plan);
            } catch (e) {
              // Ignore parsing error for fallback
            }
          }
          // Optionally handle login redirect here or let the global interceptor handle it
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Sync a plan object into state and localStorage.
   */
  setCurrentPlan(plan: any): void {
    if (plan) {
      localStorage.setItem(this.CURRENT_PLAN_KEY, JSON.stringify(plan));
      this.currentPlanSubject.next(plan);
    } else {
      localStorage.removeItem(this.CURRENT_PLAN_KEY);
      this.currentPlanSubject.next(null);
    }
  }

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

      eventSource.onerror = (error) => {
        eventSource.close();
        observer.error(new Error('SSE connection failed'));
      };

      // Khi subscriber hủy đăng ký, đóng kết nối
      return () => eventSource.close();
    });
  }
}