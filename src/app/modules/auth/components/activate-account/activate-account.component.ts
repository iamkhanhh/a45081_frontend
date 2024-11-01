import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {
  activateAccountForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;;
  user_id: any;

  private unsubscribe: Subscription[] = [];
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    this.user_id = this.route.snapshot.params.id;
  }

  get f() {
    return this.activateAccountForm.controls;
  }

  initForm() {
    this.activateAccountForm = this.fb.group({
      code: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const activateAccountSubscr = this.authService
      .activateAccount(this.f.code.value, Number(this.user_id))
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
    this.unsubscribe.push(activateAccountSubscr);
  }
}
