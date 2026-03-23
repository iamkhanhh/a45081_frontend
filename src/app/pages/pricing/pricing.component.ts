import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  selectedPlan: string = 'Basic'; // Gói mặc định được chọn

  constructor() { }

  ngOnInit(): void {
  }

  selectPlan(plan: string): void {
    this.selectedPlan = plan;
  }
}