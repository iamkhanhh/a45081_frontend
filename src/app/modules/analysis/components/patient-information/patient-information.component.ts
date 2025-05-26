import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../services/analysis.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Patient } from '../../_models/patient.model';

interface DATE_FORMAT {
  year: number,
  month: number,
  day: number
}

@Component({
  selector: 'app-patient-information',
  templateUrl: './patient-information.component.html',
  styleUrl: './patient-information.component.scss'
})
export class PatientInformationComponent {
  @Input() id: number;
  patientData: Patient;
  patientForm: FormGroup;
  isLoading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public analysisService: AnalysisService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPatientInfor();
  }

  get f() {
    return this.patientForm.controls;
  }

  loadPatientInfor() {
    this.isLoading = true;
    const sbLoadVariants = this.analysisService.loadPatientInfor(this.id)
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.patientData = res.data;
        } else {
          this.toastr.error(res.message);
        }
        this.initForm()
        this.isLoading = false;
        this.cd.detectChanges();
      })
    this.subscriptions.push(sbLoadVariants);
  }

  initForm() {
    if (this.patientData) {
      this.patientForm = this.fb.group(
        {
          id: [{ value: this.patientData.id, disabled: true }],
          first_name: [this.patientData.first_name, Validators.compose([Validators.required])],
          last_name: [this.patientData.last_name, Validators.compose([Validators.required])],
          dob: [this.formatDateString(this.patientData.dob), Validators.compose([Validators.required])],
          phenotype: [this.patientData.phenotype],
          gender: [this.patientData.gender, Validators.compose([Validators.required])],
          ethnicity: [this.patientData.ethnicity],
          sample_type: [this.patientData.sample_type],
          sample_name: [{ value: this.patientData.sample_name, disabled: true }],
          createdAt: [{ value: this.patientData.createdAt, disabled: true }]
        }
      )
    } else {
      this.patientForm = this.fb.group(
        {
          id: [{ value: '', disabled: true }],
          first_name: ['', Validators.compose([Validators.required])],
          last_name: ['', Validators.compose([Validators.required])],
          dob: ['', Validators.compose([Validators.required])],
          phenotype: [''],
          gender: ['', Validators.compose([Validators.required])],
          ethnicity: [''],
          sample_type: [''],
          sample_name: [{ value: '', disabled: true }],
          createdAt: [{ value: '', disabled: true }]
        }
      );
    }
  }

  submit() {
    let formValue = this.patientForm.value;
    formValue.dob = this.formatDate(formValue.dob);
    
    if (this.patientForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }
    
    if (!(this.patientData && this.patientData.id)) {
      this.toastr.error('The patient ID must not be null or undefined.');
      return;
    }

    this.isLoading = true;
    const sbUpdatePatient = this.analysisService.savePatientInfor(this.patientData.id, formValue).subscribe({
      next: (response: any) => {
        if (response.status == 'success') {
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message);
        this.isLoading = false;
        this.cd.detectChanges();
      },
    })
    this.subscriptions.push(sbUpdatePatient);
  }

  formatDate(date: DATE_FORMAT): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  formatDateString(date: string): DATE_FORMAT {
    const dateObj = new Date(date);
    
    return {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate()
    };
  }

  isControlValid(controlName: string): boolean {
    const control = this.patientForm?.get(controlName);
    return control?.valid && (control?.dirty || control?.touched) || false;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.patientForm?.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched) || false;
  }

  controlHasError(validation: any, controlName: any): boolean {
    const control = this.patientForm?.get(controlName);
    return control?.hasError(validation) && (control?.dirty || control?.touched) || false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
