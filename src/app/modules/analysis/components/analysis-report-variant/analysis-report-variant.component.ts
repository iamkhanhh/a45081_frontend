import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GroupingState } from 'src/app/_metronic/shared/models';
import { VariantListService } from '../../services/variant-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSelectedVariantComponent } from '../delete-selected-variant/delete-selected-variant.component';
import { DeleteSelectedReportComponent } from '../delete-selected-variant/delete-selected-report.component';
import { AnalysisReportDetailService, ReportModel, CreateReportPayload, VariantPayload } from '../../services/analysis-report-detail.service';

@Component({
  selector: 'app-analysis-report-variant',
  templateUrl: './analysis-report-variant.component.html',
  styleUrl: './analysis-report-variant.component.scss'
})
export class AnalysisReportVariantComponent {
  @Input() id: number;

  grouping: GroupingState = new GroupingState();
  isLoading: boolean;
  loadingExport = false;
  variantSelected: any[];
  reportName: string;
  reportId: number = 0;
  reports: ReportModel[] = [];
  pubmedSearchQuery: string = '';
  pubmedResults: any[] = [];
  isCreatingReport: boolean = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    public variantListService: VariantListService,
    private fb: FormBuilder,
    private modalService: NgbModal, 
    private toastr: ToastrService,
    private analysisReportDetailService: AnalysisReportDetailService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadVariantsSelected();
    this.reportName = '';
    this.loadReports();
  }

  loadReports() {
    const sb = this.analysisReportDetailService.getAllReports(this.id).subscribe((res) => {
      if (res) {
        this.reports = res;
        this.cd.detectChanges();
      }
    });
    this.subscriptions.push(sb);
  }

  loadVariantsSelected() {
    this.isLoading = true;
    const sbLoadVariants = this.variantListService.loadVariantsSelected(this.id)
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.variantSelected = res.data;
          const itemIds = this.variantSelected.map((w: any) => {
            return w.id;
          });
          this.grouping.clearRows(itemIds);
        }
        else {
          this.toastr.error(res.message);
        }
        this.isLoading = false;
        this.cd.detectChanges();
        
      })
    this.subscriptions.push(sbLoadVariants);
  }

  getVariantClass(classification: string) {
    return `${classification.split(" ").join("-")}`;
  }

  delete(variant: any) {
    console.log(variant)
    const modalRef = this.modalService.open(DeleteSelectedVariantComponent, { size: 'md' });
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.variant = variant;
    modalRef.result.then(() =>
      this.loadVariantsSelected(),
      () => { }
    );
  }

  chooseReport(id: number) {
    this.reportId = id;
  }

  getActiveClassReport(id: number) {
    return this.reportId == id ? 'active' : '';
  }

  deleteReport(report: any) {
    const modalRef = this.modalService.open(DeleteSelectedReportComponent, { size: 'md' });
    modalRef.componentInstance.id = report.id;
    modalRef.componentInstance.report = report; // Cung cấp object report cho Modal
    
    modalRef.result.then((success) => {
      if (success) {
        this.loadReports(); // Refresh the list of reports
        if (this.reportId === report.id) {
          this.chooseReport(0); // Back to "New Report" view if current report is deleted
        }
      }
    }, () => { /* User cancelled/dismissed */ });
  }

  searchPubmed() {
    if (!this.pubmedSearchQuery) return;
    
    const sb = this.analysisReportDetailService.searchPubmed(this.pubmedSearchQuery).subscribe((res: any) => {
      if (res) {
        // Ensure the results are an array for the *ngFor loop in the template
        this.pubmedResults = Array.isArray(res) ? res : [res];
        this.cd.detectChanges();
      }
    });
    this.subscriptions.push(sb);
  }

  createReport() {
    if (!this.reportName) {
        this.toastr.error('Report name is required.');
        return;
    }

    const selectedIds = this.grouping.getSelectedRows();
    if (selectedIds.length === 0) {
        this.toastr.warning('Please select at least one variant to create a report.', 'No Variants Selected');
        return;
    }

    this.isCreatingReport = true;

    const selectedVariants: VariantPayload[] = this.variantSelected
      .filter((el) => selectedIds.includes(el.id))
      .map(variant => ({
        id: variant.id,
        gene: variant.gene,
        transcript: variant.transcript_id, // Assuming transcript_id maps to transcript
        cdna: variant.cnomen, // Assuming cnomen maps to cdna
        coverage: variant.coverage,
        gad: `${variant.gnomad} / ${variant.gnomAD_AFR} / ${variant.gnomAD_AMR}`, // Combining these for gad
        classification: variant.classification
      }));

    const payload: CreateReportPayload = {
      report_name: this.reportName,
      analysisId: this.id, // Assuming 'id' in component is the analysisId
      variants: selectedVariants,
      references: this.pubmedResults.map(ref => ({
        id: ref.id,
        date: ref.date,
        source: ref.source,
        title: ref.title,
        authors: ref.authors
      }))
    };

    const sb = this.analysisReportDetailService.createReport(payload).subscribe((res: ReportModel | undefined) => {
      this.isCreatingReport = false;
      if (res) {
        this.reportName = ''; // Clear report name input
        this.grouping.clearRows(selectedIds); // Clear selected variants
        this.loadReports(); // Refresh the list of reports
        this.chooseReport(res.id); // Optionally select the newly created report
      }
      this.cd.detectChanges();
    });
    this.subscriptions.push(sb);
  }

  exportReport() {
    const header = document.getElementsByClassName('report_header')[0].innerHTML;
    const contentBody = document.getElementsByClassName('result_content')[0].innerHTML;
    const footer = document.getElementsByClassName('report-footer')[0].innerHTML;
    const htmlStartHeader = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
    const htmlStartFooter = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
    const htmlEnd = "</body></html>";
    const pageNumberJS = "<script>\
		   function subst() {\
			   var vars={};\
			   document.getElementById('page-number').style.display = 'block';\
			   document.getElementById('page-number').style.marginRight = '0';\
			   document.getElementById('page-number').style.marginLeft = 'auto';\
			   var x=document.location.search.substring(1).split('&');\
			   for (var i in x) {var z=x[i].split('=',2);vars[z[0]] = unescape(z[1]);};\
			   var x=['frompage','topage','page','webpage','section','subsection','subsubsection'];\
			   for (var i in x) {\
				   var y = document.getElementsByClassName(x[i]);\
				   for (var j=0; j<y.length; ++j) y[j].textContent = vars[x[i]];\
			   }\
			 }\
		 </script></head><body onload=\"subst()\">";

    const data = {
      header: header != undefined ? htmlStartHeader + header + htmlEnd : null,
      contentBody: contentBody,
      footer: footer != undefined ? htmlStartFooter + pageNumberJS + footer + htmlEnd : null
    }
    console.log(data)
    this.loadingExport = true;

    const sb = this.variantListService.createReport(this.id, data)
      .subscribe((res: any) => {
        console.log(res)
        if (res.body.status == 'success') {
          this.toastr.success(res.body.message);
          this.loadingExport = false;
          this.cd.detectChanges();
          setTimeout(() => {
            var url = res.body.url;
            window.open(url);
          }, 1000);
        } else {
          this.loadingExport = false;
          this.toastr.error(res.body.message);
        }
      })
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
