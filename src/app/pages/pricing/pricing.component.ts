import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PricingService } from './pricing.service';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  plans: any[] = [];
  currentSubscription: any = null;
  upsellPlan: any = null;
  selectedPlanId: number | null = null;
  isUpdating: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  // This is potentially used for the payment modal
  private planFeatures: { [key: string]: { name: string, included: boolean }[] } = {
    'Standard': [
      { name: 'Upload and analyze 10 samples per day', included: true },
      { name: 'Quality Control tab', included: true },
      { name: 'Report tab', included: true },
    ],
    'Premium': [
      { name: 'Unlimited uploads and analysis', included: true },
      { name: 'Quality Control tab', included: true },
      { name: 'Report tab', included: true },
    ]
  };

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

  loadPlans() {
    this.isLoading = true;
    this.pricingService.getPlans().pipe(
      catchError(error => {
        console.error('Failed to fetch plans:', error);
        this.error = 'Failed to load pricing plans. Please try again later.';
        this.isLoading = false;
        return of({ data: [] });
      })
    ).subscribe((res: any) => {
      this.isLoading = false;
      const plans = res?.data || res;
      if (plans && plans.length > 0) {
        this.plans = plans;

        // NOTE: In a real application, currentSubscription would be fetched from a user service.
        // Here we mock it for demonstration purposes.
        const basicPlan = this.plans.find(p => p.name === 'Basic');
        if (basicPlan) {
          this.currentSubscription = { plan: basicPlan };
          this.selectedPlanId = basicPlan.id;
        }

        // NOTE: The upsell plan logic would be more sophisticated in a real app.
        const standardPlan = this.plans.find(p => p.name === 'Standard');
        if (standardPlan) {
          this.upsellPlan = standardPlan;
        }

        this.cdr.detectChanges();
      }
    });
  }

  updatePlan(planId: number, event: Event) {
    event.stopPropagation();
    
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

        const planDataForModal = {
          name: plan.name,
          price: plan.price,
          features: this.planFeatures[plan.name] || (plan.features || []).map((f: string) => ({ name: f, included: true }))
        };

        this.dialog.open(PaymentModalComponent, {
          width: '800px',
          data: {
            ...res,
            plan: planDataForModal,
            planId: planId
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
