import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, of, Subject, Subscription, tap } from 'rxjs';
import { SampleService } from '../../services/sample.service';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType } from '@angular/common/http';

interface DATE_FORMAT {
  year: number,
  month: number,
  day: number
}
@Component({
  selector: 'app-create-sample-vcf',
  templateUrl: './create-sample-vcf.component.html',
  styleUrl: './create-sample-vcf.component.scss'
})
export class CreateSampleVcfComponent {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  formGroup: FormGroup;

  constructor(
    public readonly modal: NgbActiveModal,
    private readonly toastr: ToastrService,
    private readonly cd: ChangeDetectorRef,
    private readonly sampleService: SampleService,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      filesArr: this.fb.array([])
    })
  }


  get FilesArray() {
    return this.formGroup.controls["filesArr"] as FormArray;
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


  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.FilesArray.removeAt(index);
    this.files.splice(index, 1);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      if (item.name.indexOf('.vcf') == -1) {
        this.toastr.error(`File '${item.name}' is incorrect format`)
        continue;
      }
      else {
        item.fileType = 'vcf'
      }
      const fileForm = this.fb.group({
        sampleName: [item.name, Validators.compose([Validators.required])],
        genomeBuild: ['hg19', Validators.compose([Validators.required])],
        firstName: ['', Validators.compose([Validators.required])],
        lastName: ['', Validators.compose([Validators.required])],
        dob: ['', Validators.compose([Validators.required])],
        phenotype: ['']
      })
      this.FilesArray.push(fileForm);
      item.progress = 0;
      item.isError = false;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
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

  save() {
    this.isLoading = true;
    this.toastr.success('Start uploading files...');
    this.files.forEach((e, index) => {
      const time = Date.now();
      let uploadName = `${time}_${this.sampleService.generateRandomString(6)}_${e.name.substring(0, e.name.indexOf('.vcf')).replace(/ /g, '_')}`;
      e.uploadName = e.name;
      e.progress = 0;
    })
    let totalFile = 0;
    const uploadMultifile = setInterval(() => {
      if (totalFile++ < this.files.length) {
        this.uploadFile(this.files[totalFile - 1], totalFile - 1);
      }
      if (this.files.every((el) => el.isError == true)) {
        this.isLoading = false;
        clearInterval(uploadMultifile);
        const delayObservable = of(false).pipe(
          delay(1000),
          tap((res) => {
            this.toastr.error('Uploaded files unsuccessfully!');
          })
        );
        const sb = delayObservable.subscribe()
        this.subscriptions.push(sb);
      } else if (this.files.every((el) => el.progress == 100)) {
        this.isLoading = false;
        clearInterval(uploadMultifile);
        const delayObservable = of(true).pipe(
          delay(1000),
          tap((res) => {
            this.toastr.success('Uploaded files successfully!');
            this.modal.close();
          })
        );
        const sb = delayObservable.subscribe()
        this.subscriptions.push(sb);
      }
    }, 2000);
  }

  uploadFile(file: File, index: number) {
    this.files[index].progress += 1;
    if (file.size < 10000000) {
      const sb = this.sampleService.generateSinglePresignedUrl(file.name).subscribe((res: any) => {
        if (res.status == 'success') {
          let presignedUrl = res.data.url;
          let uploadName = res.data.uploadName;

          const uploadSub = this.sampleService.uploadSingleFile(presignedUrl, file).subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.files[index].progress = Math.round((event.loaded / event.total!) * 100);
            } else if (event.type === HttpEventType.Response) {
              const fromValue = this.FilesArray.controls[index].value;
              let data = {
                original_name: file.name,
                sample_name: fromValue.sampleName,
                file_size: file.size,
                file_type: this.files[index].fileType,
                upload_name: uploadName,
                first_name: fromValue.firstName,
                last_name: fromValue.lastName,
                dob: this.formatDate(fromValue.dob),
                phenotype: fromValue.phenotype,
                assembly: fromValue.genomeBuild
              }
              const sb2 = this.sampleService.postFileInfor(data).subscribe((response: any) => {
                if (response.status == "success") {
                  this.files[index].progress = 100;
                }
                else {
                  this.files[index].isError = true;
                  this.files[index].progress = 100;
                }
              })
              this.subscriptions.push(sb2);
            }
          }, (error) => {
            this.files[index].isError = true;
            this.toastr.error('Upload failed');
            console.error(error);

          })
          this.subscriptions.push(uploadSub);
        } else {
          this.toastr.error(res.message);
        }
      })
      this.subscriptions.push(sb);
    } else {
      const totalSize = file.size;
      const chunkSize = 10 * 1024 * 1024; // 10MB
      const numChunks = Math.ceil(totalSize / chunkSize);

      this.sampleService.startMultipartUpload(file.name).subscribe((res: any) => {
        if (res.status === 'success') {
          const uploadId = res.data.UploadId;
          const uploadName = res.data.uploadName;
          console.log('UploadId:', uploadId);
          console.log('uploadName:', uploadName);

          this.sampleService.generatePresignedUrls(uploadName, uploadId, numChunks).subscribe((res: any) => {
            if (res.status === 'success') {
              const urls = res.data.urls;
              console.log('urls', urls);
              let parts: any[] = [];
              let uploadedChunks = 0;

              const uploadChunk = (i: number) => {
                if (i >= numChunks) {
                  this.sampleService.completeMultipartUpload(uploadName, uploadId, parts).subscribe((completeRes: any) => {
                    if (completeRes.status === 'success') {
                      const fromValue = this.FilesArray.controls[index].value;
                      let data = {
                        original_name: file.name,
                        sample_name: fromValue.sampleName,
                        file_size: file.size,
                        file_type: this.files[index].fileType,
                        upload_name: uploadName,
                        first_name: fromValue.firstName,
                        last_name: fromValue.lastName,
                        dob: this.formatDate(fromValue.dob),
                        phenotype: fromValue.phenotype,
                        assembly: fromValue.genomeBuild
                      }
                      const sb2 = this.sampleService.postFileInfor(data).subscribe((response: any) => {
                        if (response.status == "success") {
                          this.files[index].progress = 100;
                        }
                        else {
                          this.files[index].isError = true;
                          this.files[index].progress = 100;
                        }
                      })
                      this.subscriptions.push(sb2);
                    } else {
                      this.files[index].isError = true;
                      this.toastr.error('Upload failed');
                      console.error(completeRes.message);
                    }
                  });
                  return;
                }

                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, totalSize);
                const chunk = file.slice(start, end);
                const presignedUrl = urls[i];

                this.sampleService.uploadSingleFile(presignedUrl, chunk).subscribe((event: any) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.files[index].progress = Math.round(((uploadedChunks + event.loaded / event.total!) / numChunks) * 100);
                  } else if (event.type === HttpEventType.Response) {
                    parts.push({
                      etag: event.headers.get('etag'),
                      PartNumber: i + 1,
                    });
                    uploadedChunks++;
                    uploadChunk(i + 1);
                  }
                }, (error) => {
                  this.files[index].isError = true;
                  this.toastr.error('Upload failed');
                  console.error(error);
                });
              };

              uploadChunk(0);
            } else {
              this.toastr.error(res.message);
            }
          });
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  checkSave() {
    if (this.files.length == 0 || this.isLoading == true || this.formGroup.invalid) {
      return true
    }
  }

  formatDate(date: DATE_FORMAT): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  getFormGroup(index: number): FormGroup {
    return this.FilesArray.controls[index] as FormGroup;
  }

  isControlValid(controlName: string, index: any): boolean {
    const control = this.FilesArray.controls[index]?.get(controlName);
    return control?.valid && (control?.dirty || control?.touched) || false;
  }

  isControlInvalid(controlName: string, index: any): boolean {
    const control = this.FilesArray.controls[index]?.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched) || false;
  }

  controlHasError(validation: any, controlName: any, index: any): boolean {
    const control = this.FilesArray.controls[index]?.get(controlName);
    return control?.hasError(validation) && (control?.dirty || control?.touched) || false;
  }

  isControlTouched(controlName: string, index: any): boolean {
    const control = this.FilesArray.controls[index]?.get(controlName);
    return control?.dirty || control?.touched || false;
  }

  ngOnDestroy() {
    if (this.isLoading == true) {
      this.toastr.error('Your upload has been terminated.');
    }

    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
