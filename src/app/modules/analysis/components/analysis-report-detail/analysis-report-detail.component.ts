import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AnalysisReportDetailService, ReportModel } from '../../services/analysis-report-detail.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analysis-report-detail',
  templateUrl: './analysis-report-detail.component.html',
})
export class AnalysisReportDetailComponent implements OnChanges, OnDestroy {
  @Input() id: number;

  url: SafeResourceUrl | null = null;
  isLoading = false;
  private report: ReportModel | undefined;
  private subscriptions: Subscription[] = [];

  constructor(
    private analysisReportDetailService: AnalysisReportDetailService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id && changes.id.currentValue > 0) {
      this.loadReport(changes.id.currentValue);
    } else {
      this.url = null;
      this.report = undefined;
    }
  }

  loadReport(reportId: number): void {
    this.isLoading = true;
    this.url = null;
    const sub = this.analysisReportDetailService.getReportById(reportId).subscribe(
      (report) => {
        this.isLoading = false;
        if (report) {
          this.report = report;
          // TODO: The fileUrl should come from the API response. Using a placeholder for now.
          const fileUrl = 'https://genetics-s3-prod.s3.ap-southeast-1.amazonaws.com/public/report_EN123.docx';
          const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
        } else {
          this.toastr.error('Failed to load report data.');
          this.url = null;
        }
        this.cd.detectChanges();
      },
      () => {
        this.isLoading = false;
        this.toastr.error('Error fetching report.');
        this.url = null;
        this.cd.detectChanges();
      }
    );
    this.subscriptions.push(sub);
  }

  downloadReport(): void {
    if (!this.id || this.id <= 0) return;
    // TODO: The download URL should come from the API. Using a placeholder.
    const fileUrl = `https://genetics-s3-prod.s3.ap-southeast-1.amazonaws.com/public/report_EN123.docx`;
    window.open(fileUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}