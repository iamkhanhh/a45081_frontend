import { ChangeDetectorRef, Component } from '@angular/core';
import { AnalysisService } from '../services/analysis.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

type Tabs =
	| 'quality_control'
	| 'variant_list'
	| 'variant_report'
	| 'patient_information';

@Component({
	selector: 'app-analysis-index',
	templateUrl: './analysis-index.component.html',
	styleUrl: './analysis-index.component.scss'
})
export class AnalysisIndexComponent {
	analysis_name = 'Analysis Name';
	id: number;
	isLoaded: boolean;
	type: string;
	project_id: number;
	activeTab: Tabs = 'quality_control';

	constructor(
		public analysisService: AnalysisService,
		private route: ActivatedRoute,
		private _location: Location,
		private cd: ChangeDetectorRef,
  ) {}

	ngOnInit(): void {
		this.id = this.route.snapshot.params.id;
		this.isLoaded = false;
		this.getAnalysisName();

	}

	getAnalysisName() {
		this.analysisService.getAnalysis(this.id)
			.subscribe((res: any) => {
				if (res.status == 'success') {
					this.project_id = res.data.project_id
					this.analysis_name = res.data.name;
					this.type = res.data.type;
				} else {
				}
				this.isLoaded = true;
				this.cd.detectChanges();

			})
	}

	setTab(tab: Tabs) {
		this.activeTab = tab;
	}

	activeClass(tab: Tabs) {
		return tab === this.activeTab ? 'show active' : '';
	}

	backClicked() {
		this._location.back();
	}
}
