import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { WorkspaceService } from '../../services/workspace.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-multiple-workspaces.',
  templateUrl: './delete-multiple-workspaces.component.html',
  styleUrl: './delete-multiple-workspaces.component.scss'
})
export class DeleteMultipleWorkspacesComponent implements OnDestroy {
  @Input() ids: number[];
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []

  constructor(
		private workspaceService: WorkspaceService,
		public modal: NgbActiveModal,
		private toastr: ToastrService
	) { }

  delete() {
    this.isLoading = true;
    const sb = this.workspaceService.deleteMultipleWorkspaces(this.ids)
    .pipe(
      delay(1000)
    )
    .subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === 'success') {
        this.toastr.success(response.message);
        this.modal.close();
      } else {
        this.toastr.error(response.message);
      }
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
