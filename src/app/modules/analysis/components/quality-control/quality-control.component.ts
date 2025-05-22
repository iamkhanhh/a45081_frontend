import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-quality-control',
  templateUrl: './quality-control.component.html',
  styleUrl: './quality-control.component.scss'
})
export class QualityControlComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @ViewChild('iframe', { static: true }) iframe: ElementRef;
  qcUrl: string = '';
  isLoading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private analysisService: AnalysisService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getVCFQC();
  }

  getVCFQC() {
    this.isLoading = true;
    const sb = this.analysisService.getQCVCF(this.id)
      .subscribe((res: any) => {
        if (res.status == "success") {
          this.qcUrl = res.data;
        } else {
          this.toastr.error(res.message)
        }
        this.isLoading = false;
      })
      this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
