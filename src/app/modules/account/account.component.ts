import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit, OnDestroy {

  data: any;
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
