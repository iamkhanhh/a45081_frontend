import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkspaceService } from '../services/workspace.service';
import { PaginatorState, PageSizes } from 'src/app/_metronic/shared/models';

export interface workspace {
  id: number;
  name: string;
  number: number;
  pipeline_name: string;
  createdAt: string;
}
@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrl: './workspace-list.component.scss'
})
export class WorkspaceListComponent implements OnInit {
  workspaces: workspace[] = [];
  paginator: PaginatorState = new PaginatorState();
  isLoading: boolean;

  constructor(
    private toastr: ToastrService,
    private workspaceService: WorkspaceService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadWorkspaces();
  }

  loadWorkspaces() {
    this.isLoading = true;
    this.workspaceService.loadWorkspaces(this.paginator.page, this.paginator.pageSize).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === 'success') {
        this.workspaces = response.data;
        this.paginator = this.paginator.recalculatePaginator(response.pageBegin, response.pageEnd, response.totalItems, response.totalPages);
        this.cd.detectChanges();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  paginate(paginator: PaginatorState) {
    this.paginator = paginator;
    this.loadWorkspaces();
  }

  newWorkspace() {
    this.toastr.success('Created a workspace successfully!', 'Success!', {
      timeOut: 3000,
    });
  }
}