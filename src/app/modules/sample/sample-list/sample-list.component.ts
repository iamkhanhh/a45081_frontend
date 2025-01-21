import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PaginatorState, GroupingState } from 'src/app/_metronic/shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SampleService } from '../services/sample.service';
import { DeleteSampleComponent } from '../components/delete-sample/delete-sample.component';
import { CreateSampleVcfComponent } from '../components/create-sample-vcf/create-sample-vcf.component';
import { CreateSampleFastqComponent } from '../components/create-sample-fastq/create-sample-fastq.component';

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
export class SampleListComponent implements OnInit {
  samples: sample[] = [];
  paginator: PaginatorState = new PaginatorState();
  isLoading: boolean;
  grouping: GroupingState = new GroupingState();

  constructor(
    private toastr: ToastrService,
    private readonly sampleService: SampleService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadSamples()
  }

  paginate(paginator: PaginatorState) {
    this.paginator = paginator;
    this.loadSamples();
  }

  loadSamples() {
    this.isLoading = true;
    this.sampleService.loadSamples(this.paginator.page, this.paginator.pageSize).subscribe((response: any) => {
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
}
