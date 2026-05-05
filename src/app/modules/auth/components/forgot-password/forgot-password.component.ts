import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit() {
    if (this.authService.isLoadingSubject.value) return;
    this.errorState = ErrorStates.NotSubmitted;
    if (!this.f.email.value || this.f.email.value.trim() === '') {
      this.toastr.error('Please fill in all required fields.');
      return;
    } else if (this.forgotPasswordForm.invalid) {
      this.toastr.error('Please enter a valid email address.');
      return;
    }
    const forgotPasswordSubscr = this.authService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      .subscribe((response: any) => {
        if (response.status == 'success') {
          this.errorState = ErrorStates.NoError;
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
          this.errorState = ErrorStates.HasError;
        }
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }
}
