import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, Subscription, tap } from 'rxjs';
import { WorkspaceService } from '../../services/workspace.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-analysis',
  templateUrl: './create-analysis.component.html',
  styleUrl: './create-analysis.component.scss'
})
export class CreateAnalysisComponent {
  @Input() projectId: any;
  pipeLine: any[] = [];
  sampleList: any[] = [];
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];
  isLoading: boolean = false;

  constructor(
    private workspaceService: WorkspaceService,
    private fb: FormBuilder, 
    private toastr: ToastrService,
    private cd: ChangeDetectorRef, 
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadpipelinees();
  }

  loadpipelinees() {
    const sb = this.workspaceService.getListPipeline()
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.pipeLine = res.data;
          this.loadForm();
          this.cd.detectChanges();
        }
        else {
          this.toastr.error(res.message);
        }
      });

    this.subscriptions.push(sb);
  }

  getSamplesByPipeLine(pipeLine: any) {
    const sb = this.workspaceService.getSamplesByPipeLine(pipeLine)
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.sampleList = res.data;
          this.formGroup.get('sampleList')?.reset('');
          this.cd.detectChanges();
        }
        else {
          this.toastr.error(res.message);
        }
      });
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      genomeBuild: ['hg19', Validators.compose([Validators.required])],
      pipeLineList: ['', Validators.compose([Validators.required])],
      sampleList: ['', Validators.compose([Validators.required])],
      analysisName: ['', Validators.compose([Validators.required])],
      description: ['']
    })
    this.cd.detectChanges();
  }

  formatSampleValue(sampleId: number, keyName: string) {
    if (sampleId) {
      let pos = this.sampleList.map(el => { return el.id }).indexOf(+sampleId);
      return this.sampleList[pos][keyName];
    }
    return ''
  }

  create() {
    this.isLoading = true;
    const formData = this.formGroup.value;
    const data = {
      name: formData.analysisName,
      project_id: this.projectId,
      pipeline_id: formData.pipeLineList,
      sample_id: formData.sampleList,
      p_type: this.formatSampleValue(formData.sampleList, 'file_type'),
      size: this.formatSampleValue(formData.sampleList, 'file_size'),
      description: formData.description,
      assembly: formData.genomeBuild
    }
    const sb = this.workspaceService.createAnalysis(data).pipe(
      delay(1000),
      tap((res: any) => {
        if (res.status == 'success') {
          this.isLoading = false;
          this.toastr.success(res.message);
          this.modal.close();
        }
        else {
          this.isLoading = false;
          this.toastr.error(res.message);
        }
      })
    ).subscribe();

    this.subscriptions.push(sb);
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: any, controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}