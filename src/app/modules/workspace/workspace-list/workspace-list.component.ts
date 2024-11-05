import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkspaceService } from '../services/workspace.service';
import { PaginatorState, PageSizes } from 'src/app/_metronic/shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateWorkspaceComponent } from '../components/create-workspace/create-workspace.component';
import { DeleteWorkspaceComponent } from '../components/delete-workspace/delete-workspace.component';

export interface workspace {
  id: number;
  name: string;
  number: number;
  pipeline_name: string;
  createdAt: string;
  updatedAt: string;
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
    private cd: ChangeDetectorRef,
    private modalService: NgbModal
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
    this.edit(undefined);
  }

	edit(id: number | undefined) {
    const modalRef = this.modalService.open(CreateWorkspaceComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.loadWorkspaces(),
      () => {}
    );
	}

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteWorkspaceComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.loadWorkspaces(),
      () => {}
    );
  }
}