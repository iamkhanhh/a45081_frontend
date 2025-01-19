import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { SampleService } from '../../services/sample.service';

@Component({
  selector: 'app-delete-sample',
  templateUrl: './delete-sample.component.html',
  styleUrl: './delete-sample.component.scss'
})
export class DeleteSampleComponent {
  @Input() ids: number[];
  isLoading = false;
  subscriptions: Subscription[] = [];
  
  constructor(
    public readonly modal: NgbActiveModal,
    private readonly sampleService: SampleService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  deleteFiles() {
    this.isLoading = true;
    const sb = this.sampleService.deleteFiles(this.ids).pipe(
      delay(1000),
      tap((res: any) => {
        if( res.status == 'success') {
          this.toastr.success(res.message);
       } else {
          this.toastr.error(res.message);
       }
       this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
