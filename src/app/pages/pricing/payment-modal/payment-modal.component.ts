import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PricingService } from '../pricing.service';
import { Subscription } from 'rxjs';

export interface PaymentModalData {
  qrCode: string;
  checkoutUrl: string;
  orderCode: string;
  plan: {
    name: string;
    price: number;
    features: { name: string; included: boolean }[];
  };
  planId: number;
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit, OnDestroy {
  isRefreshing = false;
  private paymentStreamSub: Subscription | null = null;

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentModalData,
    private pricingService: PricingService
  ) {}

  ngOnInit(): void {
    this.connectToPaymentStream();
  }

  ngOnDestroy(): void {
    if (this.paymentStreamSub) {
      this.paymentStreamSub.unsubscribe();
    }
  }

  private connectToPaymentStream(): void {
    if (this.paymentStreamSub) {
      this.paymentStreamSub.unsubscribe();
    }

    this.paymentStreamSub = this.pricingService
      .getPaymentStream(this.data.orderCode)
      .subscribe({
        next: (message) => {
          console.log('Received payment update:', message);
          if (message.status === 'PAID') {
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          console.error('Lỗi kết nối SSE:', err);
        }
      });
  }

  refreshQrCode(): void {
    this.isRefreshing = true;
    this.pricingService.createPayment({ planId: this.data.planId }).subscribe({
      next: (res: any) => {
        this.data.qrCode = res.qrCode;
        this.data.checkoutUrl = res.checkoutUrl;
        this.data.orderCode = res.orderCode;
        this.isRefreshing = false;
        // Thiết lập lại kết nối SSE với orderCode mới
        this.connectToPaymentStream();
      },
      error: (err) => {
        console.error('Failed to refresh QR code', err);
        this.isRefreshing = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  closeOnBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-container')) {
      this.close();
    }
  }
}