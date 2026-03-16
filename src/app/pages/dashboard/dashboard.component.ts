import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ListItem } from '../../_metronic/partials/content/widgets/lists/lists-widget1/lists-widget1.component';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { DashboardService, DashboardData } from './dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Thuộc tính cho các widget thống kê
  totalWorkspaces: string = '0';
  totalAnalyses: string = '0';
  totalSamples: string = '0';

  // Thuộc tính cho các widget biểu đồ
  analysesStatusData: { name: string; data: number[] }[] = [];
  sampleFileTypeData: { name: string; data: number[] }[] = [];
  sampleAssemblyData: { name: string; data: number[] }[] = [];
  samplesCreatedData: { name: string; data: number[] }[] = [];
  analysesCreatedData: { name: string; data: number[] }[] = [];

  // Thuộc tính cho widget danh sách
  recentAnalyses: ListItem[] = [];

  isLoading = false;
  private subscriptions: Subscription[] = [];

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loadingSub = this.dashboardService.isLoading$.subscribe(res => {
      this.isLoading = res;
      this.cdr.detectChanges(); // Ép Angular cập nhật lại View ngay lập tức
    });
    this.subscriptions.push(loadingSub);

    const dataSub = this.dashboardService.dashboardData$.subscribe(data => {
      if (data) {
        try {
          this.processDashboardData(data);
        } catch (error) {
          console.error('Lỗi khi map dữ liệu từ API:', error);
        }
        this.cdr.detectChanges(); // Ép Angular cập nhật dữ liệu mới lên Dashboard
      }
    });
    this.subscriptions.push(dataSub);

    // Bắt đầu quá trình lấy dữ liệu
    this.subscriptions.push(
      this.dashboardService.fetchDashboardData().subscribe()
    );
  }

  private processDashboardData(data: DashboardData): void {
    // 1. Gán các số liệu thống kê đơn giản
    this.totalWorkspaces = data.workspaces.toString();
    this.totalAnalyses = data.analyses.toString();
    this.totalSamples = data.samples.toString();

    // 2. Chuyển đổi dữ liệu cho các biểu đồ tròn
    this.analysesStatusData = Object.entries(data.analysisByStatus).map(([key, value]) => ({
      name: key.toUpperCase(),
      data: [value]
    }));

    this.sampleFileTypeData = Object.entries(data.samplesByFileType).map(([key, value]) => ({
      name: key.toUpperCase(),
      data: [value]
    }));

    // Lưu ý: Xử lý tên 'samplesbyAsembly' có lỗi chính tả từ API
    this.sampleAssemblyData = Object.entries(data.samplesbyAsembly).map(([key, value]) => ({
      name: key.toUpperCase(),
      data: [value]
    }));

    // 3. Chuyển đổi dữ liệu cho các biểu đồ miền (area chart)
    this.samplesCreatedData = [{
      name: 'Samples',
      data: data.samplesLastSixMonths
    }];

    this.analysesCreatedData = [{
      name: 'Analyses',
      data: data.analysisLastSixMonths
    }];

    // 4. Chuyển đổi dữ liệu cho danh sách các phân tích gần đây
    this.recentAnalyses = data.recentAnalyses.map(analysis => ({
      icon: './assets/media/icons/duotune/general/gen022.svg',
      title: analysis.name,
      subtitle: `Workspace: ${analysis.workspaceName} | Status: ${analysis.status}`
    }));
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
