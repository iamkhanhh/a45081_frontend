import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ResponseModel } from '../models/response.model';
import { ToastrService } from 'ngx-toastr';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((response: ResponseModel) => {
        return response;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        this.toastr.error(err.error.message);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  redirectToLogin() {
    return this.router.navigateByUrl('/auth/login');
  }

  activateAccount(code: string, user_id: number): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .activateAccount(code, user_id)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((err) => {
          console.error('err', err);
          this.toastr.error(err.error.message);
          return of(undefined);
        }),
        finalize(() => {this.isLoadingSubject.next(false)})
      );
  }

  logout() {
		return this.authHttpService.logout().pipe(
			map((response: ResponseModel) => {
				return true;
			}),
      catchError((err) => {
        console.error('err', err);
        this.toastr.error(err.error.message);
        return of(undefined);
      })
    )
	}

  getUserByToken(): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken().pipe(
      map((response: any) => {
        if (response.status == 'success') {
          this.currentUserSubject.next(response.data);
          return response.data;
        } else {
          this.logout();
        }
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map((response) => {
        this.isLoadingSubject.next(false);
        return response
      }),
      // switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        this.toastr.error(err.error.message);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((err) => {
          console.error('err', err);
          this.toastr.error(err.error.message);
          return of(undefined);
        }),
        finalize(() => {this.isLoadingSubject.next(false)})
      );
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private convertResponse(response: any): ResponseModel {
		let res = new ResponseModel;
		res.status = response.body.status;
		res.message = response.body.message || '';
		res.data = response.body.data || {};
		return res;
	}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
