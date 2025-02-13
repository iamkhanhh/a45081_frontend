import { CDK_DRAG_CONFIG, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000
};
@Component({
  selector: 'app-create-sample-fastq',
  templateUrl: './create-sample-fastq.component.html',
  styleUrl: './create-sample-fastq.component.scss',
  providers: [
    { provide: CDK_DRAG_CONFIG, useValue: DragConfig }]
})
export class CreateSampleFastqComponent implements OnInit, OnDestroy {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  filesUploading: any[] = [];
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  testId = 'reverse'
  formGroup: FormGroup;
  dragForm: any[] = [];
  formGroupLists: FormGroup[] = [];

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      filesArr: this.fb.array([])
    })
  }

  get FilesArray(): FormArray {
    return this.formGroup.get("filesArr") as FormArray;
  }

  /**
  * on file drop handler
  */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.prepareFilesList(Array.from(input.files));
    }
  }

  deleteFile(index: number) {
    let pos = this.filesUploading.indexOf(this.files[index].uploadName);
    this.filesUploading.splice(pos, 1);
    this.files.splice(index, 1);
  }

  deleteForm(index: number) {
    this.FilesArray.removeAt(index);
    this.formGroupLists.splice(index, 1);
    this.dragForm.splice(index, 1);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      if ((item.name.substring(item.name.indexOf('.fastq')) != '.fastq' && item.name.substring(item.name.indexOf('.fastq')) != '.fastq.gz') && (item.name.substring(item.name.indexOf('.fq')) != '.fq' && item.name.substring(item.name.indexOf('.fq')) != '.fq.gz')) {
        this.toastr.error(`File '${item.name}' is incorrect format`);
        continue;
      }
      else if (!this.checkFastqFileName(item.name)) {
        this.toastr.error(`Filename '${item.name}' is not in the correct format`);
        continue;
      }
      else {
        item.fileType = 'fastq';
      }
      item.progress = 0;
      item.isUploaded = false;
      item.isError = false;
      item.isProcessing = true;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
    this.save();
  }

  addForm() {
    const fileForm = this.fb.group({
      sampleName: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      phenotype: ['']
    })
    this.FilesArray.push(fileForm);
    this.formGroupLists.push(fileForm);
    this.dragForm.push({ forward: [], reverse: [] });
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  checkFastqFileName(name: string) {
    if (
      name.indexOf('_R1_') != -1 || name.indexOf('_R2_') != -1 || name.indexOf('_1') != -1 || name.indexOf('_2') != -1 || name.indexOf('_1_') != -1 || name.indexOf('_2_') != -1
    ) {
      return true;
    }
    return false;
  }

  checkDragForm(): boolean {
    return this.dragForm.every(item => item.forward.length > 0 && item.reverse.length > 0);
  }  

  checkSave() {
    // if (this.formGroup.invalid || this.FilesArray.length == 0 || this.isLoading) {
    //   return true
    // }

    if (this.formGroup.invalid || this.formGroupLists.length == 0 || this.isLoading || !this.checkDragForm()) {
      return true
    }
  }

  save() {
    console.log('SAVE');
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  fowardPredicate(item: CdkDrag<any>) {
    if (item.data.name.indexOf('_R1_') == -1 && item.data.name.indexOf('_1_') == -1 && item.data.name.indexOf('_1') == -1) {
      return false;
    }
    return true;
  }

  reversePredicate(item: CdkDrag<any>) {
    if (item.data.name.indexOf('_R2_') == -1 && item.data.name.indexOf('_2_') == -1 && item.data.name.indexOf('_2') == -1) {
      return false;
    }
    return true;
  }

  isControlValid(controlName: string, index: any): boolean {
    // const control = this.FilesArray.controls[index]?.get(controlName);
    const control = this.formGroupLists[index]?.get(controlName);
    return control?.valid && (control?.dirty || control?.touched) || false;
  }

  isControlInvalid(controlName: string, index: any): boolean {
    // const control = this.FilesArray.controls[index]?.get(controlName);
    const control = this.formGroupLists[index]?.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched) || false;
  }

  controlHasError(validation: any, controlName: any, index: any): boolean {
    // const control = this.FilesArray.controls[index]?.get(controlName);
    const control = this.formGroupLists[index]?.get(controlName);
    return control?.hasError(validation) && (control?.dirty || control?.touched) || false;
  }

  isControlTouched(controlName: string, index: any): boolean {
    // const control = this.FilesArray.controls[index]?.get(controlName);
    const control = this.formGroupLists[index]?.get(controlName);
    return control?.dirty || control?.touched || false;
  }

  ngOnDestroy() {
    if (this.isLoading == true) {
      this.toastr.error('Your upload has been terminated.');
    }

    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
