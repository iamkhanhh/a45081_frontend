import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PricingService } from './pricing.service';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { PaymentModalData } from './payment-modal/payment-modal.component';

export interface Plan {
  id: number;
  name: string;
  planType: string;
  price: number;
  description?: string;
  features: string[];
  dailyUploadLimit: number | string;
  dailyAnalysisLimit: number | string;
  duration?: string;
}

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  plans: Plan[] = [];
  currentSubscription: any = null;
  upsellPlan: any = null;
  selectedPlanId: number | null = null;
  isUpdating: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private pricingService: PricingService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  selectPlan(planId: number) {
    this.selectedPlanId = planId;
  }

  isCurrentPlan(planType: string): boolean {
    return this.currentSubscription?.plan?.planType === planType;
  }

  isHigherPlan(planType: string): boolean {
    const order: Record<string, number> = { 'BASIC': 0, 'STANDARD': 1, 'PREMIUM': 2 };
    const currentType = this.currentSubscription?.plan?.planType;
    return order[currentType] > order[planType];
  }

  getPlanByType(planType: string): Plan | undefined {
    return this.plans.find(p => p.planType === planType);
  }

  loadPlans() {
    this.isLoading = true;

    forkJoin({
      plans: this.pricingService.getPlans().pipe(
        catchError(error => {
          console.error('Failed to fetch plans:', error);
          return of({ data: [] });
        })
      ),
      subscription: this.pricingService.getSubscription().pipe(
        catchError(error => {
          console.error('Failed to fetch subscription:', error);
          return of(null);
        })
      )
    }).subscribe(({ plans, subscription }) => {
      this.isLoading = false;

      const planList = plans?.data || plans;
      if (planList && planList.length > 0) {
        this.plans = planList;

        const standardPlan = this.plans.find(p => p.planType === 'STANDARD');
        if (standardPlan) {
          this.upsellPlan = standardPlan;
        }
      }

      const currentPlan = subscription?.data?.plan || subscription?.data;
      if (currentPlan) {
        this.currentSubscription = { plan: currentPlan };
        this.selectedPlanId = currentPlan.id;
        this.pricingService.setCurrentPlan(currentPlan);
      } else {
        // Fallback: đọc từ localStorage nếu API lỗi
        const stored = this.pricingService['currentPlanSubject'].getValue();
        if (stored) {
          this.currentSubscription = { plan: stored };
          this.selectedPlanId = stored.id;
        }
      }

      this.cdr.detectChanges();
    });
  }

  updatePlan(planId: number | undefined, event: Event) {
    event.stopPropagation();

    if (!planId) {
      this.error = 'Selected plan not found.';
      return;
    }

    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      this.error = 'Selected plan not found.';
      return;
    }

    this.selectedPlanId = planId;
    this.isUpdating = true;
    this.error = null;

    this.pricingService.createPayment({ planId }).subscribe({
      next: (res: any) => {
        this.isUpdating = false;

        const planDataForModal: PaymentModalData['plan'] = {
          name: plan.name,
          price: plan.price,
          features: (plan.features || []).map((f: string) => ({ name: f, included: true })),
          dailyUploadLimit: plan.dailyUploadLimit,
          dailyAnalysisLimit: plan.dailyAnalysisLimit,
        };

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        this.dialog.open<PaymentModalComponent, PaymentModalData>(PaymentModalComponent, {
          width: '800px',
          data: {
            ...res,
            plan: planDataForModal,
            planId: planId,
            expirationDate: expirationDate
          }
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Payment creation failed:', err);
        this.error = 'An error occurred while creating the payment. Please try again.';
        this.isUpdating = false;
        this.cdr.detectChanges();
      }
    });
  }
}