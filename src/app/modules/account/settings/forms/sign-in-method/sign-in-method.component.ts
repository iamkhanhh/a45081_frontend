import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { ConfirmPasswordValidator } from 'src/app/modules/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in-method',
  templateUrl: './sign-in-method.component.html',
})
export class SignInMethodComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  changePasswordForm: FormGroup;
  private unsubscribe: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/)
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  savePassword() {
    this.isLoading$.next(true);
    const formData = this.changePasswordForm.value;
    let data = {
      oldPassword: formData.oldPassword,
      password: formData.password,
    };
    const sbUpdatePassword = this.accountService.updatePassword(data).subscribe({
      next: (response: any) => {
        if (response.status == 'success') {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
        this.reset();
      },
      error: (error) => {
        this.reset();
        console.error(error);
        this.toastr.error(error.error.message);
      },
    })
    this.unsubscribe.push(sbUpdatePassword);
  }

  reset() {
    this.changePasswordForm.reset();
    this.isLoading$.next(false);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isControlValid(controlName: string): boolean {
    const control = this.changePasswordForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.changePasswordForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.changePasswordForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.changePasswordForm.controls[controlName];
    return control.dirty || control.touched;
  }
}
