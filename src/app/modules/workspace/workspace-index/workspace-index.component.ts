import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PaginatorState } from 'src/app/_metronic/shared/models';
import { WorkspaceService } from '../services/workspace.service';
import { ActivatedRoute } from '@angular/router';

export interface analysis {
  id: number;
  name: string;
  number: number;
  pipeline_name: string;
  createdAt: string;
  updatedAt: string;
  analyzed: string;
  variants: number;
  size: string;
  status: string
}
@Component({
  selector: 'app-workspace-index',
  templateUrl: './workspace-index.component.html',
  styleUrl: './workspace-index.component.scss'
})
export class WorkspaceIndexComponent implements OnInit {
  workspace_name: string = '';
  workspace_id: number;
  analyses: analysis[] = []
  paginator: PaginatorState = new PaginatorState();
  isLoading: boolean;

  constructor(
    private toastr: ToastrService,
    private workspaceService: WorkspaceService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.workspace_id = this.route.snapshot.params.id;
    this.loadAnalyses();
  }

  loadAnalyses() {
    this.isLoading = true;
    this.workspaceService.getWorkspaceName(this.workspace_id).subscribe((response: any) => {
      if (response.status === 'success') {
        this.workspace_name = response.data;
        this.cd.detectChanges();
      } else {
        this.toastr.error(response.message);
      }
    });
    this.workspaceService.loadAnalyses(this.workspace_id, this.paginator.page, this.paginator.pageSize).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === 'success') {
        this.analyses = response.data;
        this.paginator = this.paginator.recalculatePaginator(response.pageBegin, response.pageEnd, response.totalItems, response.totalPages);
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
    this.toastr.success('Created a anaysis successfully!', 'Success!', {
      timeOut: 3000,
    });
  }
}
