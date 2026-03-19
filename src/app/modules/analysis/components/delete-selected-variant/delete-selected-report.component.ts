import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AnalysisReportDetailService } from '../../services/analysis-report-detail.service';

@Component({
  selector: 'app-delete-selected-report',
  templateUrl: './delete-selected-report.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class DeleteSelectedReportComponent implements OnDestroy {
  @Input() id: number;
  @Input() report: any;
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private reportService: AnalysisReportDetailService
  ) {}

  delete() {
    this.isLoading = true;
    const reportId = this.report.id;
    const sb = this.reportService.deleteReport(reportId).subscribe((success) => {
      this.isLoading = false;
      if (success) {
        this.modal.close(true);
      } else {
        this.modal.dismiss('error');
      }
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}