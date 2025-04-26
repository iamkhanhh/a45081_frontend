import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { catchError, first, of, Subscription, tap } from 'rxjs';
import { UserService } from '../../services/user-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/modules/auth/models/user.model';
import { ConfirmPasswordValidator } from 'src/app/modules/auth';

const EMPTY_USER: UserModel = {
  first_name: '',
  last_name: '',
  password: '',
  email: '',
  role: 'User',
  status: 'Pending',
  phone_number: '',
  setUser(user: any) { },
  setAuth(auth: any) { },
  institution: '',
  address: ''
}
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  @Input() id: number;
  isLoading: boolean = false
  user: UserModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = []

  constructor(
    private readonly userService: UserService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    if (!this.id) {
      this.user = EMPTY_USER;
      this.loadForm();
    } else {
      const sb = this.userService.getUserById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_USER);
        })
      ).subscribe((user: UserModel) => {
        this.user = user;
        this.loadFormEdit();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      first_name: [this.user.first_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      last_name: [this.user.last_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      status: [this.user.status],
      role: [this.user.role, Validators.compose([Validators.required])],
      phone_number: [this.user.phone_number],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/)])],
      cPassword: [''],
    },
      {
        validator: ConfirmPasswordValidator.MatchPasswordEdit
      }
    );
    if (!this.id) {
      this.formGroup.reset();
    }
  }

  loadFormEdit() {
    this.formGroup = this.fb.group({
      first_name: [this.user.first_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      last_name: [this.user.last_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      status: [this.user.status],
      role: [this.user.role, Validators.compose([Validators.required])],
      phone_number: [this.user.phone_number],
      password: [null, Validators.compose([Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/)])],
      cPassword: [null],
    },
      {
        validator: ConfirmPasswordValidator.MatchPasswordEdit
      }
    );
  }

  save() {
    this.prepareUser();
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    let self = this
    self.isLoading = true
    const sbUpdate = this.userService.updateUser(this.user).pipe(
      tap((res: any) => {
        self.isLoading = false
        if (res.status == 'success') {
          this.toastr.success(res.message);
          this.modal.close();
        } else {
          this.toastr.error(res.message);
        }
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }

  create() {
    let self = this
    self.isLoading = true
    const sbCreate = this.userService.createUser(this.user).pipe(
      tap((res: any) => {
        self.isLoading = false
        if (res.status == 'success') {
          this.toastr.success(res.message);
          this.modal.close();
        } else {
          this.toastr.error(res.message);
        }
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe();
    this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formData = this.formGroup.value;
    this.user.first_name = formData.first_name;
    this.user.last_name = formData.last_name;
    this.user.email = formData.email;
    this.user.phone_number = formData.phone_number;
    this.user.role = formData.role;
    this.user.password = formData.password;
    this.user.status = formData.status;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
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
