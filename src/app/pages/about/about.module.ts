import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutComponent,
      },
    ]),
  ],
})
export class AboutModule {}
