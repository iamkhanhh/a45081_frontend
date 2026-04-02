import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PricingComponent } from './pricing.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: PricingComponent
  }
];

@NgModule({
  declarations: [PricingComponent, PaymentModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    QRCodeComponent, // Import the standalone component directly to make its selector available.
    MatDialogModule
  ]
})
export class PricingModule { }