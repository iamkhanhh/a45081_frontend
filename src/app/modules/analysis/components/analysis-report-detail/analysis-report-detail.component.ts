import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analysis-report-detail',
  templateUrl: './analysis-report-detail.component.html',
  styleUrl: './analysis-report-detail.component.scss'
})
export class AnalysisReportDetailComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading: boolean;

  private subscriptions: Subscription[] = [];
  
    constructor(
      public analysisService: AnalysisService,
      private fb: FormBuilder,
      private modalService: NgbModal, 
      private toastr: ToastrService,
      private cd: ChangeDetectorRef
    ) { }
  
    ngOnInit(): void {
      this.loadReportData()
    }

    loadReportData() {
    // this.isLoading = true;
    // const sbLoadVariants = this.variantListService.loadReportData(this.id)
    //   .subscribe((res: any) => {
    //     if (res.status == 'success') {
    //       this.variantSelected = res.data;
    //       const itemIds = this.variantSelected.map((w: any) => {
    //         return w.id;
    //       });
    //       this.grouping.clearRows(itemIds);
    //     }
    //     else {
    //       this.toastr.error(res.message);
    //     }
    //     this.isLoading = false;
    //     this.cd.detectChanges();

    //   })
    // this.subscriptions.push(sbLoadVariants);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
