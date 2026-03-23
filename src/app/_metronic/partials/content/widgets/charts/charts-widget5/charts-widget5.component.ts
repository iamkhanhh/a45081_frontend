import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';

@Component({
  selector: 'app-charts-widget5',
  templateUrl: './charts-widget5.component.html',
})
export class ChartsWidget5Component implements OnInit, OnChanges {
  chartOptions: any = {};
  @Input() pieData: { name: string; data?: number[] }[] | null = null;
  @Input() seriesData: { name: string; data?: number[] }[] | null = null;
  @Input() chartType: string = 'bar';
  @Input() title: string = '';
  @Input() subtitle: string = '';

  hasData: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
  }

  initChart(): void {
    const data = this.seriesData && this.seriesData.length ? this.seriesData : this.pieData;
    if (data && data.length > 0) {
      this.hasData = true;
      this.chartOptions = getChartOptions(data, this.chartType);
    } else {
      this.hasData = false;
    }
  }
}

function getChartOptions(data?: { name: string; data?: number[] }[] | null, chartType: string = 'bar') {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  const baseColor = getCSSVariableValue('--bs-primary')
  const secondaryColor = getCSSVariableValue('--bs-info')
  const successColor = getCSSVariableValue('--bs-success')
  const warningColor = getCSSVariableValue('--bs-warning')
  const dangerColor = getCSSVariableValue('--bs-danger')
  const darkColor = getCSSVariableValue('--bs-dark')

  const series = data || [];

  if (chartType === 'pie') {
    return {
      series: series.map(s => s.data ? s.data[0] : 0),
      chart: {
        fontFamily: 'inherit',
        type: 'pie',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: [baseColor, successColor, warningColor, dangerColor, secondaryColor, darkColor],
      labels: series.map(s => s.name),
      legend: {
        show: true,
        position: 'bottom',
        height: 100,
        formatter: function (seriesName: string, opts: any) {
          return seriesName.length > 20 ? seriesName.substring(0, 20) + '...' : seriesName;
        }
      },
      plotOptions: {
        pie: {
          customScale: 1
        }
      }
    };
  }

  // Tự động tạo mảng nhãn 6 tháng gần nhất cho trục X
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    last6Months.push(d.toLocaleString('default', { month: 'short' }));
  }

  return {
    series: series,
    chart: {
      fontFamily: 'inherit',
      type: chartType,
      stacked: true,
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
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
      categories: last6Months,
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
    colors: [baseColor, successColor, warningColor, dangerColor, secondaryColor, darkColor],
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
