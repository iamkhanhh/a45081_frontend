import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SampleListComponent } from './sample-list/sample-list.component';
import { SampleComponent } from './sample.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { DeleteSampleComponent } from './components/delete-sample/delete-sample.component';
import { DropdownCreateSampleComponent } from './components/dropdown-create-sample/dropdown-create-sample.component';
import { CreateSampleVcfComponent } from './components/create-sample-vcf/create-sample-vcf.component';
import { CreateSampleFastqComponent } from './components/create-sample-fastq/create-sample-fastq.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    SampleListComponent,
    SampleComponent,
    DeleteSampleComponent,
    DropdownCreateSampleComponent,
    CreateSampleVcfComponent,
    CreateSampleFastqComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    SampleRoutingModule,
    SharedModule,
    NgbDropdownModule
  ]
})
export class SampleModule { }
