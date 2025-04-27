import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserModel } from 'src/app/modules/auth';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  user: UserModel;
  formGroup: FormGroup;
  private unsubscribe: Subscription[] = [];

  constructor(
    private accountService: AccountService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount() {
    const sbAccount = this.accountService.account().subscribe((res: any) => {
      if (res.status === 'success') {
        this.user = res.data;
        this.loadFormEdit();
        this.cd.detectChanges();
      } else {
        this.toastr.error(res.message);
      }
    });
    this.unsubscribe.push(sbAccount);
  }

  loadFormEdit() {
    this.formGroup = this.fb.group({
      first_name: [this.user.first_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      last_name: [this.user.last_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      email: [{ value: this.user.email, disabled: true }, Validators.compose([Validators.required, Validators.email])],
      institution: [this.user.institution],
      phone_number: [this.user.phone_number, Validators.compose([Validators.pattern(/^\d+$/)])],
      address: [this.user.address],
    });
  }

  saveSettings() {
    this.isLoading$.next(true);
    const formValue = this.formGroup.value;
    console.log('formValue', formValue);
    const sbSaveSettings = this.accountService.update(formValue).subscribe({
      next: (response: any) => {
        if (response.status == 'success') {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading$.next(false);
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message);
        this.isLoading$.next(false);
        this.cd.detectChanges();
      },
    })
    this.unsubscribe.push(sbSaveSettings);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}