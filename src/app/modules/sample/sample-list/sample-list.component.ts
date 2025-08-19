import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PaginatorState, GroupingState } from 'src/app/_metronic/shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SampleService } from '../services/sample.service';
import { DeleteSampleComponent } from '../components/delete-sample/delete-sample.component';
import { CreateSampleVcfComponent } from '../components/create-sample-vcf/create-sample-vcf.component';
import { CreateSampleFastqComponent } from '../components/create-sample-fastq/create-sample-fastq.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

export interface sample {
  id: number;
  name: string;
  type: string;
  status: string;
  size: number;
  assembly: string;
  createdAt: string;
}
@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrl: './sample-list.component.scss'
})
export class SampleListComponent implements OnInit, OnDestroy {
  samples: sample[] = [];
  paginator: PaginatorState = new PaginatorState();
  grouping: GroupingState = new GroupingState();
  isLoading: boolean;
  filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private toastr: ToastrService,
    private readonly sampleService: SampleService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.filterForm();
    this.loadSamples();

    // this.sampleService.getStatusUpdate().subscribe((data: any) => {
    //   const index = this.samples.findIndex(a => a.id === data.id);
    //   if (index !== -1) {
    //     this.samples[index].status = data.status;
    //     this.cd.detectChanges();
    //   }
    // });
  }

  paginate(paginator: PaginatorState) {
    this.paginator = paginator;
    this.loadSamples();
  }

  loadSamples() {
    this.isLoading = true;
    const formValue = this.filterGroup.value;
    this.sampleService.loadSamples(this.paginator.page, this.paginator.pageSize, formValue).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === 'success') {
        this.samples = response.data;
        const itemIds = this.samples.map((w: sample) => {
          return w.id;
        });
        this.paginator = this.paginator.recalculatePaginator(response.pageBegin, response.pageEnd, response.totalItems, response.totalPages);
        this.grouping.clearRows(itemIds);
        this.cd.detectChanges();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteSampleComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.loadSamples(),
      () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteSampleComponent, { size: 'md' });
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() =>
      this.loadSamples(),
      () => { }
    );
  }

  /**
  * format bytes
  * @param bytes (File size in bytes)
  * @param decimals (Decimals point)
  */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes == 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  openModalUploadVcf() {
    const modalRef = this.modalService.open(CreateSampleVcfComponent, { size: 'xl' });
    modalRef.result.then(() =>
      this.loadSamples(),
      () => { }
    );
  }

  openModalUploadFastq() {
    const modalRef = this.modalService.open(CreateSampleFastqComponent, { size: 'xl', scrollable: true });
    modalRef.result.then(() =>
      this.loadSamples(),
      () => { }
    );
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      type: [''],
      searchTerm: [''],
      assembly: ['']
    });
    this.subscriptions.push(
      this.filterGroup.valueChanges.subscribe((values) => {
        this.loadSamples()
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
