import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DashboardService, DashboardData } from './dashboard.service';
import { AuthService } from '../../modules/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalWorkspaces = '0';
  totalAnalyses = '0';
  totalSamples = '0';
  activeAnalyses = '0';

  analysesStatusData: { name: string; data: number[] }[] = [];
  sampleFileTypeData: { name: string; data: number[] }[] = [];
  sampleAssemblyData: { name: string; data: number[] }[] = [];
  combinedTrendData: { name: string; data: number[] }[] = [];
  lastSixMonths: string[] = [];

  recentAnalyses: any[] = [];
  isLoading = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  get todayLabel(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  get userName(): string {
    const user = this.authService.currentUserValue;
    return user?.first_name + ' ' + user?.last_name || user?.email?.split('@')[0] || 'there';
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dashboardService.isLoading$.subscribe(res => {
        this.isLoading = res;
        this.cdr.detectChanges();
      }),
      this.dashboardService.dashboardData$.subscribe(data => {
        if (data) {
          try { this.processDashboardData(data); } catch (e) { console.error(e); }
          this.cdr.detectChanges();
        }
      }),
      this.dashboardService.fetchDashboardData().subscribe()
    );
  }

  private processDashboardData(data: DashboardData): void {
    this.totalWorkspaces = data.workspaces.toString();
    this.totalAnalyses = data.analyses.toString();
    this.totalSamples = data.samples.toString();

    const inProgressStatuses = ['Analyzing', 'Queuing', 'Importing'];
    const activeCount = Object.entries(data.analysisByStatus)
      .filter(([key]) => inProgressStatuses.some(s => key.includes(s)))
      .reduce((sum, [, val]) => sum + (val as number), 0);
    this.activeAnalyses = activeCount.toString();

    this.analysesStatusData = Object.entries(data.analysisByStatus).map(([key, value]) => ({
      name: key, data: [value as number]
    }));

    this.sampleFileTypeData = Object.entries(data.samplesByFileType).map(([key, value]) => ({
      name: key.toUpperCase(), data: [value as number]
    }));

    this.sampleAssemblyData = Object.entries(data.samplesbyAsembly).map(([key, value]) => ({
      name: key.toUpperCase(), data: [value as number]
    }));

    this.combinedTrendData = [
      { name: 'Samples', data: data.samplesLastSixMonths },
      { name: 'Analyses', data: data.analysisLastSixMonths },
    ];

    this.lastSixMonths = data.lastSixMonths || [];
    this.recentAnalyses = data.recentAnalyses;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
