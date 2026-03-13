import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
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
