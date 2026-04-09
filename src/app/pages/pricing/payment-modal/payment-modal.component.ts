import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PricingService } from '../pricing.service';
import { Subscription, interval } from 'rxjs'; // Import interval
import { takeWhile, tap } from 'rxjs/operators'; // Import operators
import { ToastrService } from 'ngx-toastr';

export interface PaymentModalData {
  qrCode: string;
  checkoutUrl: string;
  orderCode: string;
  plan: {
    name: string;
    price: number;
    features: { name: string; included: boolean }[];
    dailyUploadLimit: number | string;
    dailyAnalysisLimit: number | string;
  };
  planId: number;
  expirationDate: Date; // This is for the plan's expiry, not QR code
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit, OnDestroy {
  isRefreshing = false;
  private paymentStreamSub: Subscription | null = null;
  private countdownSubscription: Subscription | null = null; // New subscription for countdown
  countdownSeconds: number = 0; // Remaining seconds for QR code
  countdownDisplay: string = '10:00'; // Formatted display for countdown
  private hasShownSuccessToast = false; // Flag to prevent duplicate toasts

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentModalData,
    private pricingService: PricingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('Plan data:', this.data.plan);
    this.connectToPaymentStream(); // Start SSE connection
    this.startCountdown(); // Start countdown when modal opens
  }

  ngOnDestroy(): void {
    if (this.paymentStreamSub) {
      this.paymentStreamSub.unsubscribe();
    }
    this.stopCountdown(); // Stop countdown when modal closes
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
            if (!this.hasShownSuccessToast) {
              this.hasShownSuccessToast = true;
              this.toastr.success('Payment successful!', 'Success');
              
              // Update plan in local storage and state
              this.pricingService.setCurrentPlan(this.data.plan);
              
              // Optionally fetch latest plan from backend if you need exact backend structure
              // this.pricingService.fetchCurrentPlan().subscribe();
            }
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          console.error('Lỗi kết nối SSE:', err);
          // Optionally, show an error message to the user
        }
      });
  }

  private startCountdown(): void {
    this.stopCountdown(); // Stop any existing countdown
    this.countdownSeconds = 10 * 60; // Reset to 10 minutes (600 seconds)
    this.updateCountdownDisplay(); // Initial display update

    this.countdownSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.countdownSeconds >= 0), // Continue while seconds are non-negative
        tap(() => {
          this.countdownSeconds--;
          this.updateCountdownDisplay();
        })
      )
      .subscribe({
        next: () => {
          if (this.countdownSeconds < 0) { // Timer has run out
            console.log('QR code expired, refreshing...');
            this.refreshQrCode(); // Automatically refresh QR code
          }
        },
        error: (err) => console.error('Countdown error:', err),
        complete: () => console.log('Countdown completed.')
      });
  }

  private stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = null;
    }
  }

  private updateCountdownDisplay(): void {
    const minutes = Math.floor(this.countdownSeconds / 60);
    const seconds = this.countdownSeconds % 60;
    this.countdownDisplay = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  refreshQrCode(): void {
    this.isRefreshing = true;
    this.stopCountdown(); // Stop current countdown before refreshing
    this.pricingService.createPayment({ planId: this.data.planId }).subscribe({ // Assuming planId is sufficient
      next: (res: any) => {
        this.data.qrCode = res.qrCode;
        this.data.checkoutUrl = res.checkoutUrl;
        this.data.orderCode = res.orderCode;
        this.isRefreshing = false;
        // Thiết lập lại kết nối SSE với orderCode mới
        this.connectToPaymentStream();
        this.startCountdown(); // Start new countdown for the new QR code
      },
      error: (err) => {
        console.error('Failed to refresh QR code', err);
        this.isRefreshing = false;
        // Optionally, restart countdown with error or show message
        this.startCountdown(); // Restart countdown even on error to allow user to try again
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