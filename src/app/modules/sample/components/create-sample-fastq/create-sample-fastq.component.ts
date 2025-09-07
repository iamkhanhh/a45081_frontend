import { CDK_DRAG_CONFIG, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { concatMap, filter, from, map, Subscription, tap, toArray } from 'rxjs';
import { SampleService } from '../../services/sample.service';
import { HttpEventType } from '@angular/common/http';

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000
};

interface DATE_FORMAT {
  year: number,
  month: number,
  day: number
}

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
    private readonly sampleService: SampleService,
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
    if (this.formGroup.invalid || this.formGroupLists.length == 0 || this.isLoading || !this.checkDragForm()) {
      return true
    }
    return false;
  }

  save() {
    this.toastr.success('Start uploading files...');
    this.files.forEach((e) => {
      if (!e.isUploaded) {
        e.isUploaded = true;
        this.filesUploading.push(e.name);
      }
    })

    const uploadFastqFiles = setInterval(() => {
      if (this.filesUploading.length != 0) {
        let fileUploadName = this.filesUploading.shift();
        let pos = this.files.map(el => { return el.name }).indexOf(fileUploadName);
        this.uploadFile(this.files[pos], pos);
      }
      else {
        clearInterval(uploadFastqFiles);
      }
    }, 5000);
  }

  uploadFile(file: File, index: number) {
    console.log('Uploading file: ', file);

    const totalSize = file.size;
    const chunkSize = 10 * 1024 * 1024; // 10MB
    const numChunks = Math.ceil(totalSize / chunkSize);
    this.files[index].progress = 10;

    let data = {
      original_name: file.name,
      file_size: file.size,
      file_type: this.files[index].fileType
    };

    const sb = this.sampleService.createUploadFastQ(data).pipe(
      concatMap((res: any) => {
        if (res.status !== 'success') throw new Error(res.message);

        this.files[index].uploadId = res.uploadId;
        return this.sampleService.startMultipartUpload(file.name);
      }),
      concatMap((res: any) => {
        if (res.status !== 'success') throw new Error(res.message);

        const uploadId = res.data.UploadId;
        const uploadName = res.data.uploadName;
        this.files[index].uploadName = uploadName;

        return this.sampleService.generatePresignedUrls(uploadName, uploadId, numChunks).pipe(
          map((urlRes: any) => {
            if (urlRes.status !== 'success') throw new Error(urlRes.message);
            return { urls: urlRes.data.urls, uploadId, uploadName };
          })
        );
      }),
      concatMap(({ urls, uploadId, uploadName }) =>
        from(Array.from({ length: numChunks }, (_, i) => i)).pipe(
          concatMap((i: number) => {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, totalSize);
            const chunk = file.slice(start, end);
            const presignedUrl = urls[i];

            return this.sampleService.uploadSingleFile(presignedUrl, chunk).pipe(
              tap((event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                  this.files[index].progress = Math.round(((i + event.loaded / event.total!) / numChunks) * 100);
                }
              }),
              filter(event => event.type === HttpEventType.Response),
              map(event => ({
                etag: event.headers.get('etag'),
                PartNumber: i + 1
              }))
            );
          }),
          toArray(),
          concatMap(parts => this.sampleService.completeMultipartUpload(uploadName, uploadId, parts)),
          map(res => ({ res }))
        )
      ),
      concatMap(({ res }) => {
        if(res.status == "success") {
            return this.sampleService.updateStatusUploadFastQ(this.files[index].uploadId, 'success')
        }
        else {
            return this.sampleService.updateStatusUploadFastQ(this.files[index].uploadId, 'error')
        }
      })
    ).subscribe({
      next: (res: any) => {
        this.files[index].isProcessing = false;
        if (res.status === 'success') {
          this.files[index].progress = 100;
        } else {
          this.files[index].progress = 100;
          this.files[index].isError = true;
          this.toastr.error('Upload failed');
        }
      },
      error: (err) => {
        this.files[index].isError = true;
        this.toastr.error('Upload failed');
        console.error(err);
      }
    });
    this.subscriptions.push(sb);
  }

  createSample() {
    this.isLoading = true;
    if (!this.checkFastqPairValid()) {
      this.toastr.error('Create sample failed since invalid format!');
      this.isLoading = false;
      return false;
    }
    let data = [];
    for (let index in this.formGroupLists) {
      const fromValue = this.FilesArray.controls[index].value;
      let temp = {
        sampleName: fromValue.sampleName,
        firstName: fromValue.firstName,
        lastName: fromValue.lastName,
        dob: this.formatDate(fromValue.dob),
        phenotype: fromValue.phenotype,
        file_type: 'fastq',
        file_size: this.getSampleSize(Number(index)),
        forward: this.dragForm[index]['forward'].map((el: any) => ({
          uploadId: el.uploadId,
          uploadName: el.uploadName
        })),
        reverse: this.dragForm[index]['reverse'].map((el: any) => ({
          uploadId: el.uploadId,
          uploadName: el.uploadName
        }))
      }
      data.push(temp);
    }
    console.log(data);

    const sb = this.sampleService.createSampleFastQ(data).subscribe((res: any) => {
      if (res.status == 'success') {
        this.toastr.success('Create samples successfully!');
      } else {
        this.toastr.error('Create samples failed!');
      }
      this.isLoading = false;
      this.modal.close();
    })
  }

  formatDate(date: DATE_FORMAT): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  checkFastqPairValid() {
    let check: boolean = false;
    this.dragForm.forEach(e => {
      if (e.forward.length == 0 || e.reverse.length == 0) {
        check = true;
        e.message = 'Number of files in \'Forward\' and \'Reverse\' must be greater than 0.';
      }
      else if (e.forward.length != e.reverse.length) {
        check = true;
        e.message = 'The number of files in \'Forward\' must be the same length as the number of files in \'Reverse\'.';
      }
      else {
        e.message = '';
      }
    })
    if (check) {
      return false;
    }
    return true;
  }

  getSampleSize(index: number) {
    let totalSizeForward = this.dragForm[index]['forward'].reduce((sum: number, el: any) => {
      return sum + el.size
    }, 0);
    let totalSizeReverse = this.dragForm[index]['reverse'].reduce((sum: number, el: any) => {
      return sum + el.size
    }, 0);

    return totalSizeForward + totalSizeReverse
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
