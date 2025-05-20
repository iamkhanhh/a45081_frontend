import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GroupingState } from 'src/app/_metronic/shared/models';
import { VariantListService } from '../../services/variant-list.service';

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
  private subscriptions: Subscription[] = [];
  variantSelected: any[];
  url: any;
  htmlString: string;
  htmlData: any;

  constructor(
    public variantListService: VariantListService,
    private fb: FormBuilder,
    // private modalService: NgbModal, 
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadVariantsSelected()
  }

  loadVariantsSelected() {
    this.isLoading = true;
    const sbLoadVariants = this.variantListService.loadVariantsSelected(this.id)
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.variantSelected = res.data;
          const itemIds = this.variantSelected.map((w: any) => {
            return w._id;
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

  edit(id: number) {

  }

  delete(variant: any) {
    console.log(variant)

  }

  deleteSelected() {

  }

  fetchSelected() {

  }

  createReport() {
    let selectedIds = this.grouping.getSelectedRows();
    let selectedFilter = this.variantSelected.filter((el) => {
      return selectedIds.includes(el.id)
    })
    // const sb = this.variantListService.createReport({selectedFilter})
    // .subscribe((res : any) => {
    //     if(res.body.status == 'success') {
    //         this.toastr.success(res.body.message);
    //         this.htmlString = res.body.html;
    //         this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.htmlString);
    //         this.cd.detectChanges();
    //     } else {
    //         this.toastr.error(res.body.message);
    //     }
    // })
    // this.subscriptions.push(sb);    

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
