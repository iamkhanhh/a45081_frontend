import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { Variant } from '../../_models/variant.model';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

type Tabs =
	| 'gene_detail'
	| 'variant_detail';

interface GeneDetail {
  full_name: string,
  synonyms: string,
  function: string,
}

@Component({
  selector: 'app-gene-detail',
  templateUrl: './gene-detail.component.html',
  styleUrl: './gene-detail.component.scss'
})
export class GeneDetailComponent implements OnInit, OnDestroy {
  @Input() variant: Variant;
  gene: GeneDetail;
  isLoading: boolean = false;
  activeTab: Tabs = 'gene_detail';

  private subscriptions: Subscription[] = [];

  constructor(
    private analysisService: AnalysisService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getGeneDetail()
  }

  getGeneDetail() {
    const sb = this.analysisService.getGeneDetail(this.variant.gene).subscribe({
      next: (response: any) => {
        if (response.status == 'success') {
          this.gene = response.data;
        } else {
          this.toastr.error(response.message);
        }
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error.message);
      },
    })
    this.subscriptions.push(sb);
  }

  checkExist(value: string) {
    if (value == '' || value == '.' || value == null) {
      return false
    } else {
      return true
    }
  }

  buildOMIM(gene_omim: string) {
    var html = ''

    if (gene_omim == '.') {
      html += gene_omim
    } else {
      html += `<a href="http://omim.org/entry/${gene_omim}" target="_blank">${gene_omim}</a> `
    }

    return html
  }

  buildCosmicId(cosmicIds: any) {
    var html = ''

    if (cosmicIds != undefined && cosmicIds != '') {
      var value = cosmicIds.split("|");

      cosmicIds = value[0];
    } else {
      cosmicIds = '';
    }

    if (cosmicIds == '.') {
      html += cosmicIds
    } else {
      html += '<a href="http://cancer.sanger.ac.uk/cosmic/mutation/overview?id=' + cosmicIds.replace('COSM', '') + '" target="_blank">' + cosmicIds + '</a>'
    }

    return html
  }

  setTab(tab: Tabs) {
		this.activeTab = tab;
	}

	activeClass(tab: Tabs) {
		return tab === this.activeTab ? 'show active' : '';
	}

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
