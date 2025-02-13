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
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DndDirective } from './directives/dnd.directive';
import { ProgressComponent } from './components/progress/progress.component';
import { ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    SampleListComponent,
    SampleComponent,
    DeleteSampleComponent,
    DropdownCreateSampleComponent,
    CreateSampleVcfComponent,
    CreateSampleFastqComponent,
    DndDirective,
    ProgressComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    SampleRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgbDatepickerModule, 
    NgbAlertModule,
    ReactiveFormsModule,
    DragDropModule
  ],
})
export class SampleModule { }
