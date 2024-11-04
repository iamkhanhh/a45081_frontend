import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { WorkspaceService } from '../../services/workspace.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


const EMPTY_WORKSPACE =  {
	id: undefined,
	name: '',
	pipeline: 0,
	dashboard: ''
}

export interface pipeline {
	id: number;
  name: string;
}
@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrl: './create-workspace.component.scss'
})
export class CreateWorkspaceComponent implements OnInit, OnDestroy {
  @Input() id: any;
  isLoading: boolean = false;
  currentUser: UserModel | undefined;
  formGroup: FormGroup;
  workspace: any;
  pipelines: pipeline[] = [];
  private subscriptions: Subscription[] = []

  constructor(
		private workSpacesService: WorkspaceService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private toastr: ToastrService,
		private cd : ChangeDetectorRef,
		private authService: AuthService
	) { }

  ngOnInit(): void {
		this.currentUser = this.authService.currentUserValue;
		this.loadWorkspace();
		this.loadPipeline();
	}

  loadWorkspace() {
		if (!this.id) {
			this.workspace = EMPTY_WORKSPACE;
			this.loadForm();
		} else {
			const sb = this.workSpacesService.getWorkspaceById(this.id).pipe(
			  ).subscribe((response: any) => {
          if (response.status == 'success') {
            this.workspace = response.data;
            this.loadFormEdit();
          } else {
            this.toastr.error(response.message);
          }
			  });
			  this.subscriptions.push(sb);
		}
	}

	loadForm() {
		this.formGroup = this.fb.group({
			name: [this.workspace.name, Validators.compose([Validators.required, Validators.maxLength(100)])],
			pipeline: [this.workspace.pipeline, Validators.compose([Validators.required])],
			dashboard: [this.workspace.dashboard,]
		});
		if (!this.id) {
		  this.formGroup.reset();
		}
	}

	loadFormEdit() {
		this.formGroup = this.fb.group({
			name: [this.workspace.name, Validators.compose([Validators.required, Validators.maxLength(100)])],
			pipeline: [this.workspace.pipeline, Validators.compose([Validators.required])],
			dashboard: [this.workspace.dashboard,]
		})
	}

	save() {
		this.prepareWorkspace();
		if (this.id) {
			this.edit()
		} else {
			this.create()
		}
	}

  edit() {

  }

  create() {
		this.isLoading = true;
		const sb = this.workSpacesService.create(this.formGroup.value).pipe(
		).subscribe((response: any) => {
			if (response.status == 'success') {
				this.toastr.success(response.message);
				this.modal.close();
			} else {
				this.toastr.error(response.message);
			}
		});
		this.subscriptions.push(sb);
  }

  formatSelect2data(data: any) {
		for(let i in data) {
			data[i].id = data[i].id
			data[i].name = data[i].name + " " + data[i].version
		}
		return data
	}

	private prepareWorkspace() {
		const formData = this.formGroup.value;
		this.workspace.name = formData.name;
		this.workspace.pipeline = formData.pipeline
		this.workspace.dashboard = formData.dashboard
	}

  loadPipeline() {
		let self = this
		const sb = self.workSpacesService.getListPipeline().pipe()
			.subscribe((res: any) => {
        if (res.status == 'success') {
          this.pipelines = this.formatSelect2data(res.data)
          this.cd.detectChanges();
        } else {
          this.toastr.error(res.message);
        }
		});
		this.subscriptions.push(sb)
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

	controlHasError(validation: any, controlName: any): boolean {
		const control = this.formGroup.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName: any): boolean {
		const control = this.formGroup.controls[controlName];
		return control.dirty || control.touched;
	}
  
}
