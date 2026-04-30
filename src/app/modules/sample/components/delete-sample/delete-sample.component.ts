import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { SampleService } from '../../services/sample.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-workspace',
  templateUrl: './delete-sample.component.html',
  styleUrl: './delete-sample.component.scss'
})
export class DeleteSampleComponent implements OnDestroy {
  @Input() id: any;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []

  constructor(
		private sampleService: SampleService,
		public modal: NgbActiveModal,
		private toastr: ToastrService
	) { }

  delete() {
    this.isLoading = true;
    const sb = this.sampleService.deleteFiles(this.id)
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
