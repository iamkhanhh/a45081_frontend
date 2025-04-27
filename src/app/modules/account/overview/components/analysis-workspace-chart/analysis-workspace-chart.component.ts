import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { getCSSVariableValue } from 'src/app/_metronic/kt/_utils';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analysis-workspace-chart',
  templateUrl: './analysis-workspace-chart.component.html',
  styleUrl: './analysis-workspace-chart.component.scss'
})
export class AnalysisWorkspaceChartComponent implements OnInit, OnDestroy {
  chartOptions: any = {};
  private subscriptions: Subscription[] = [];
  
  constructor(
    private accountService: AccountService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const sbAccount = this.accountService.getAccountStatistics().subscribe((res) => {
      if (res.status === 'success') {
        // this.data = res.data;
        this.chartOptions = getChartOptions(350, res.data.lastSixMonths, res.data.analysesStatistics, res.data.workspacesStatistics);
        this.cd.detectChanges();
      } else {
        this.toastr.error(res.message);
      }
    });
    this.subscriptions.push(sbAccount);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}

function getChartOptions(height: number, lastSixMonths: string[], analysesStatistics: number[], workspacesStatistics: number[]) {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = getCSSVariableValue('--bs-primary')
  const secondaryColor = getCSSVariableValue('--bs-gray-300')

  return {
    series: [
      {
        name: 'Analyses',
        data: analysesStatistics,
      },
      {
        name: 'Workspaces',
        data: workspacesStatistics,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: lastSixMonths,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return val;
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
