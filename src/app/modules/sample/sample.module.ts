import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SampleListComponent } from './sample-list/sample-list.component';
import { SampleComponent } from './sample.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';


@NgModule({
  declarations: [
    SampleListComponent,
    SampleComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    SampleRoutingModule,
    SharedModule
  ]
})
export class SampleModule { }
