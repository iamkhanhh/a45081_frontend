import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay, Subscription } from 'rxjs';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-delete-multiple-user',
  templateUrl: './delete-multiple-user.component.html',
  styleUrl: './delete-multiple-user.component.scss'
})
export class DeleteMultipleUserComponent {
  @Input() ids: number[];
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []

  constructor(
    private readonly userService: UserService,
    public modal: NgbActiveModal,
    private toastr: ToastrService
  ) { }

  delete() {
    this.isLoading = true;
    const sb = this.userService.deleteMultipleUsers(this.ids)
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
