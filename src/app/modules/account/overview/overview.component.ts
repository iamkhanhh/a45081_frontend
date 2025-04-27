import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../auth';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  data: UserModel;
  private subscriptions: Subscription[] = [];

  constructor(
    private accountService: AccountService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount() {
    const sbAccount = this.accountService.account().subscribe((res) => {
      if (res.status === 'success') {
        this.data = res.data;
        this.cd.detectChanges();
      } else {
        this.toastr.error(res.message);
      }
    });
    this.subscriptions.push(sbAccount);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
