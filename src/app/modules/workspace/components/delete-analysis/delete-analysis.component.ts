import { Component, Input, OnDestroy } from '@angular/core';
import { WorkspaceService } from '../../services/workspace.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-analysis',
  templateUrl: './delete-analysis.component.html',
  styleUrl: './delete-analysis.component.scss'
})
export class DeleteAnalysisComponent implements OnDestroy  {
  @Input() id: any;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []

  constructor(
		private workspaceService: WorkspaceService,
		public modal: NgbActiveModal,
		private toastr: ToastrService
	) { }

  delete() {
    this.isLoading = true;
    const sb = this.workspaceService.deleteAnalysis(this.id)
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
