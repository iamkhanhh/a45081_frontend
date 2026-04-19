import {NgModule} from '@angular/core';
import {KeeniconComponent} from './keenicon/keenicon.component';
import {CommonModule} from "@angular/common";
import { PaginatorComponent } from './paginator/paginator.component';
import { SortIconComponent } from './sort-icon/sort-icon.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    KeeniconComponent,
    PaginatorComponent,
    SortIconComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    FormsModule,
    TranslateModule
  ],
  exports: [
    KeeniconComponent,
    PaginatorComponent,
    SortIconComponent
  ]
})
export class SharedModule {
}
