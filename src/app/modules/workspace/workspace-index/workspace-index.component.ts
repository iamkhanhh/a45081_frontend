import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GroupingState, PaginatorState } from 'src/app/_metronic/shared/models';
import { WorkspaceService } from '../services/workspace.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAnalysisComponent } from '../components/delete-analysis/delete-analysis.component';
import { CreateAnalysisComponent } from '../components/create-analysis/create-analysis.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface analysis {
  id: number;
  name: string;
  pipeline_name: string;
  createdAt: string;
  updatedAt: string;
  analyzed: string;
  variants: number;
  assembly: string;
  size: string;
  status: string
}
@Component({
  selector: 'app-workspace-index',
  templateUrl: './workspace-index.component.html',
  styleUrl: './workspace-index.component.scss'
})
export class WorkspaceIndexComponent implements OnInit, OnDestroy {
  workspace_name: string = '';
  workspace_id: number;
  analyses: analysis[] = [];
  paginator: PaginatorState = new PaginatorState();
  grouping: GroupingState = new GroupingState();
  isLoading: boolean;
  filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private toastr: ToastrService,
    private workspaceService: WorkspaceService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.workspace_id = this.route.snapshot.params.id;
    this.filterForm();
    this.loadAnalyses();
  }

  loadAnalyses() {
    this.isLoading = true;
    const formValue = this.filterGroup.value;
    this.workspaceService.getWorkspaceName(this.workspace_id).subscribe((response: any) => {
      if (response.status === 'success') {
        this.workspace_name = response.data;
        this.cd.detectChanges();
      } else {
        this.toastr.error(response.message);
      }
    });
    this.workspaceService.loadAnalyses(this.workspace_id, this.paginator.page, this.paginator.pageSize, formValue).subscribe((response: any) => {
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
  }

  paginate(paginator: PaginatorState) {
    this.paginator = paginator;
    this.loadAnalyses();
  }

  newAnalysis() {
    const modalRef = this.modalService.open(CreateAnalysisComponent, { size: 'md' });
    modalRef.componentInstance.projectId = this.workspace_id;
    modalRef.result.then(() =>
      this.loadAnalyses(),
      () => {}
    );
  }

  deleteSelected() {

  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteAnalysisComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.loadAnalyses(),
      () => {}
    );
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      analysisName: [''],
      sampleName: [''],
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
