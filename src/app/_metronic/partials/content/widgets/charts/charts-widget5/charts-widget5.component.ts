import { Component, OnInit, Input } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';

@Component({
  selector: 'app-charts-widget5',
  templateUrl: './charts-widget5.component.html',
})
export class ChartsWidget5Component implements OnInit {
  chartOptions: any = {};
  @Input() pieData: { name: string; data?: number[] }[] | null = null;
  @Input() chartType: 'bar' | 'pie' = 'bar';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  constructor() {}

  ngOnInit(): void {
    this.chartOptions = getChartOptions(this.pieData, this.chartType);
  }
}

function getChartOptions(pieData?: { name: string; data?: number[] }[] | null, chartType: 'bar' | 'pie' = 'bar') {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  const baseColor = getCSSVariableValue('--bs-primary')
  const secondaryColor = getCSSVariableValue('--bs-info')

  const series = pieData && pieData.length ? pieData : [
    { name: 'Missense', data: [45] },
    { name: 'Synonymous', data: [30] },
    { name: 'Nonsense', data: [15] },
    { name: 'Frameshift', data: [10] },
  ];

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
      labels: series.map(s => s.name),
      legend: {
        show: true,
      },
    };
  }

  return {
    series: series,
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
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
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
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
      min: 0,
      max: 80,
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
          return '$' + val + ' thousands';
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
