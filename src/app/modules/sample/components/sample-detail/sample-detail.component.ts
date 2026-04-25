import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SampleService } from '../../services/sample.service';

interface Upload {
  id: number;
  original_name: string;
  file_size: number;
  file_type: string;
  upload_name: string;
  file_path: string;
  fastq_pair_index: number | null;
  upload_status: number;
  createdAt: string;
}

interface SampleDetail {
  id: number;
  name: string;
  file_type: string;
  file_size: number;
  assembly: string;
  complete_status: number;
  createdAt: string;
  uploads: Upload[];
}

@Component({
  selector: 'app-sample-detail',
  templateUrl: './sample-detail.component.html',
  styleUrl: './sample-detail.component.scss'
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  @Input() id: number;
  sample: SampleDetail | null = null;
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private sampleService: SampleService,
  ) {}

  ngOnInit(): void {
    this.loadSample(this.id);
  }

  loadSample(id: number): void {
    this.isLoading = true;
    const sb = this.sampleService.loadSample(id).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status === 'success') {
          this.sample = res.data;
        } else {
          this.toastr.error(res.message);
        }
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load sample');
        this.cd.detectChanges();
      }
    });
    this.subscriptions.push(sb);
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  downloadFile(upload: Upload): void {
    const a = document.createElement('a');
    a.href = upload.file_path;
    a.download = upload.original_name;
    a.target = '_blank';
    a.click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
