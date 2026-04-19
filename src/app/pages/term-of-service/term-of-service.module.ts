import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TermOfServiceComponent } from './term-of-service.component';

@NgModule({
  declarations: [TermOfServiceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TermOfServiceComponent,
      },
    ]),
  ],
})
export class TermOfServiceModule {}
