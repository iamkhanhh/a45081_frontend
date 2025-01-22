import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkspaceService } from '../services/workspace.service';
import { PaginatorState, GroupingState } from 'src/app/_metronic/shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateWorkspaceComponent } from '../components/create-workspace/create-workspace.component';
import { DeleteWorkspaceComponent } from '../components/delete-workspace/delete-workspace.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

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
export class WorkspaceListComponent implements OnInit, OnDestroy {
  workspaces: workspace[] = [];
  paginator: PaginatorState = new PaginatorState();
  isLoading: boolean;
  grouping: GroupingState = new GroupingState();
  filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private toastr: ToastrService,
    private workspaceService: WorkspaceService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.filterForm();
    this.loadWorkspaces();
  }

  loadWorkspaces() {
    this.isLoading = true;
    const formValue = this.filterGroup.value;
    formValue.searchDate = formValue.searchDate != '' ? `${formValue.searchDate.year}-${formValue.searchDate.month}-${formValue.searchDate.day}`: '';
    this.workspaceService.loadWorkspaces(this.paginator.page, this.paginator.pageSize, formValue).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === 'success') {
        this.workspaces = response.data;
        const itemIds = this.workspaces.map((w: workspace) => {
          return w.id;
        });
        this.paginator = this.paginator.recalculatePaginator(response.pageBegin, response.pageEnd, response.totalItems, response.totalPages);
        this.grouping.clearRows(itemIds);
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

  deleteSelected() {

  }

  filterForm() {
    this.filterGroup = this.fb.group({
      searchDate: [''],
      searchTerm: ['']
    });
    this.subscriptions.push(
      this.filterGroup.valueChanges.subscribe((values) => {
        this.loadWorkspaces()
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}