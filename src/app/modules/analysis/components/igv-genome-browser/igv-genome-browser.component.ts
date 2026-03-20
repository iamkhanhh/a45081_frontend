import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnalysisService } from '../../services/analysis.service';
import { Subscription } from 'rxjs';
import { Analysis } from '../../_models/analysis.model';

declare const igv: any;

@Component({
  selector: 'app-igv-genome-browser',
  templateUrl: './igv-genome-browser.component.html',
  styleUrl: './igv-genome-browser.component.scss'
})
export class IgvGenomeBrowserComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() chrom: string;
  @Input() geneName: string;
  @Input() position: number;
  @Input() id: number;

  @ViewChild('igv', { static: true }) igvContainer: ElementRef;
  loading = false;
 	bamIndexUrl: string;
	bamUrl: string;
  fastaUrl: string;
  fastaIndexUrl: string
  geneUrl: string;
  error: string;
  igv: any;
  analysis: Analysis | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private analysisService: AnalysisService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

	ngOnInit(): void {
		this.igv = igv;
	}

	ngAfterViewInit(): void {
		setTimeout(() =>{
			this.getIgvInfo();
		}, 500)
	}

	getIgvInfo() {
		const sb = this.analysisService.getIgvInfo(this.id).subscribe((response: any) => {
			if (response.status == 'success') {
				let data = response.data
				this.bamUrl = data.bamUrl;
				this.bamIndexUrl = data.bamIndexUrl;
				this.fastaUrl = data.fastaUrl;
				this.fastaIndexUrl = data.fastaIndexUrl;
				this.geneUrl = data.geneUrl;
				this.analysis = data.analysis;
				this.openIGVBrowser();
			}
		})
    this.subscriptions.push(sb);
	}

  async openIGVBrowser() {
    this.loading = true;
    try {
      this.igvContainer.nativeElement.innerHTML = '';

      const tracks = [
        {
          type: 'alignment',
          format: 'bam',
          url: this.bamUrl,
          indexURL: this.bamIndexUrl,
          name: this.analysis?.name || 'Sample BAM',
          height: 300,
        },
        {
          name: 'Genes',
          format: 'refgene',
          url: this.geneUrl,
          displayMode: 'EXPANDED',
        },
      ];

      igv.createBrowser(this.igvContainer.nativeElement, {
        genome: this.analysis?.assembly || 'hg38',
        locus: `chr${this.chrom}:${this.position}-${this.position}`,
        loadDefaultGenomes: false,
        showKaryo: false,
        showIdeogram: true,
        showNavigation: true,
        showRuler: true,
        showCenterGuide: true,
        reference: {
          fastaURL: this.fastaUrl,
          indexURL: this.fastaIndexUrl,
        },
        tracks,
      });
    } catch (e) {
      this.error = 'Failed to initialize IGV.';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
