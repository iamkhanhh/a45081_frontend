import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PricingService } from 'src/app/pages/pricing/pricing.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
})
export class PaymentsComponent implements OnInit, OnDestroy {
  payments: any[] = [];
  selectedPayment: any = null;
  isLoading = false;
  error: string | null = null;

  private unsubscribe: Subscription[] = [];

  constructor(
    private pricingService: PricingService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.error = null;

    const sub = this.pricingService.getPayments().subscribe({
      next: (res) => {
        this.payments = res?.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Không thể tải dữ liệu payment';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.unsubscribe.push(sub);
  }

  viewPayment(payment: any, content: any): void {
    this.selectedPayment = payment;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  getStatusClass(status: string): string {
    if (!status) return 'badge-light-secondary';

    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'badge badge-light-success';
      case 'PENDING':
        return 'badge badge-light-warning';
      case 'FAILED':
        return 'badge badge-light-danger';
      default:
        return 'badge badge-light-secondary';
    }
  }

  formatDate(date: string | null): string {
    if (!date) return 'Unpaid';
    return new Date(date).toLocaleString();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }
}