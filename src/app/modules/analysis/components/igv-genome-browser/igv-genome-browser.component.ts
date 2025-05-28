import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnalysisService } from '../../services/analysis.service';
import { Subscription } from 'rxjs';
import { Variant } from '../../_models/variant.model';

@Component({
  selector: 'app-igv-genome-browser',
  templateUrl: './igv-genome-browser.component.html',
  styleUrl: './igv-genome-browser.component.scss'
})
export class IgvGenomeBrowserComponent implements OnInit, OnDestroy {
  @Input() chrom: string;
  @Input() position: number;
  @Input() id: number;

  private subscriptions: Subscription[] = [];

  constructor(
    private analysisService: AnalysisService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
