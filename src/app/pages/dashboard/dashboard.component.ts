import { Component, ViewChild } from '@angular/core';
import { ListItem } from '../../_metronic/partials/content/widgets/lists/lists-widget1/lists-widget1.component';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  totalWorkspaces = '10';
  totalAnalyses = '50';
  totalSamples = '100';

  analysesStatusData = [
    { name: 'QUEUING', data: [10] },
    { name: 'ANALYZING', data: [20] },
    { name: 'ANALYZED', data: [30] },
    { name: 'ERROR', data: [5] },
    { name: 'VEP_ANALYZED', data: [15] },
    { name: 'FASTQ_QUEUING', data: [5] },
    { name: 'FASTQ_ANALYZING', data: [5] },
    { name: 'FASTQ_ERROR', data: [2] },
    { name: 'IMPORTING', data: [8] },
  ];

  sampleFileTypeData = [
    { name: 'VCF', data: [60] },
    { name: 'FASTQ', data: [40] },
  ];

  sampleAssemblyData = [
    { name: 'hg19', data: [70] },
    { name: 'hg38', data: [30] },
  ];

  samplesCreatedData = [
    { name: 'Samples', data: [10, 20, 30, 40, 50, 60] },
  ];

  analysesCreatedData = [
    { name: 'Analyses', data: [15, 25, 35, 45, 55, 65] },
  ];

  recentAnalyses: ListItem[] = [
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 1', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 2', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 3', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 4', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 5', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 6', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 7', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 8', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 9', subtitle: 'Completed' },
    { icon: './assets/media/icons/duotune/general/gen022.svg', title: 'Analysis 10', subtitle: 'Completed' },
  ];

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;

  // mock data for widgets
  qualitySeries = [20, 30, 25, 28, 32, 22];
  variantChartData = [
    { name: 'SNPs', data: [10000, 12000, 9000, 11000, 10500, 9500] },
    { name: 'Indels', data: [4000, 3500, 3000, 2800, 3200, 3100] },
  ];
  impactPie = [
    { name: 'Missense', data: [45] },
    { name: 'Synonymous', data: [30] },
    { name: 'Nonsense', data: [15] },
    { name: 'Frameshift', data: [10] }
  ];

  constructor() {}

  async openModal() {
    return await this.modalComponent.open();
  }
}
