import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PricingComponent } from './pricing.component';

const routes: Routes = [
  {
    path: '',
    component: PricingComponent
  }
];

@NgModule({
  declarations: [PricingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PricingModule { }