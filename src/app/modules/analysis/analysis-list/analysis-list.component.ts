import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GroupingState, PaginatorState } from 'src/app/_metronic/shared/models';
import { AnalysisService } from '../services/analysis.service';

export interface analysis {
  id: number;
  name: string;
  analyzed: string;
  variants: number;
  assembly: string;
  workspaceName: string;
  status: string;
  createdAt: string
}
@Component({
  selector: 'app-analysis-list',
  templateUrl: './analysis-list.component.html',
  styleUrl: './analysis-list.component.scss'
})
export class AnalysisListComponent implements OnInit, OnDestroy {
  analyses: analysis[] = [];
  paginator: PaginatorState = new PaginatorState();
  grouping: GroupingState = new GroupingState();
  isLoading: boolean = false;
  filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private analysisService: AnalysisService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.filterForm();
    this.loadAnalyses();
  }

  loadAnalyses() {
    this.isLoading = true;
    const formValue = this.filterGroup.value;
    const sb = this.analysisService.loadAnalyses(this.paginator.page, this.paginator.pageSize, formValue).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === 'success') {
        this.analyses = response.data;
        this.paginator = this.paginator.recalculatePaginator(response.pageBegin, response.pageEnd, response.totalItems, response.totalPages);
        const itemIds = this.analyses.map((a: analysis) => {
          return a.id;
        });
        this.grouping.clearRows(itemIds);
        this.cd.detectChanges();
      } else {
        this.toastr.error(response.message);
      }
    });
    this.subscriptions.push(sb);
  }

  paginate(paginator: PaginatorState) {
    this.paginator = paginator;
    this.loadAnalyses();
  }

  deleteSelected() {

  }

  delete(id: number) {
    // const modalRef = this.modalService.open(DeleteAnalysisComponent, { size: 'md' });
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(() =>
    //   this.loadAnalyses(),
    //   () => { }
    // );
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      analysisName: [''],
      assembly: [''],
      status: ['']
    });
    this.subscriptions.push(
      this.filterGroup.valueChanges.subscribe((values) => {
        this.loadAnalyses()
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
