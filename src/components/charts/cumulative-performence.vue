<template>
  <div
    ref="chart"
    class="fill-height"
    align="center"
    justify="center"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IEXCloudClient from 'node-iex-cloud';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component
export default class WidgetCumperf extends Vue {
  iexToken = this.$store.state.config.iexToken;

  isSandbox = this.$store.state.config.isSandbox;

  symbol = this.$store.state.analyze.symbol;

  iexSummaryData = '';

  makeSummaryChart(data: any) {
    const chart = am4core.create(
      this.$refs.chart as HTMLElement,
      am4charts.XYChart,
    );

    chart.paddingRight = 20;

    const chartData = [];

    for (let i = 0; i < data.length; i += 1) {
      // convert date string to date object to speed up chart perf
      // and enable chart axis grouping
      const parsedDate = new Date(data[i].date);

      let todayPerf = 0;
      let yesterdayPerf = 0;
      let cumulPerf = 0;
      let cumulPerfPerc = 0;

      if (i > 0) {
        todayPerf = data[i].close / data[i - 1].close;
      }

      if (i > 1) {
        yesterdayPerf = data[i - 1].close / data[i - 2].close;

        cumulPerf = todayPerf * yesterdayPerf;

        cumulPerfPerc = cumulPerf - 1;
      }

      chartData.push({ date: parsedDate, value: cumulPerfPerc });
    }

    chart.data = chartData;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;

    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 1;

    // add bullet
    const bullet = series.bullets.push(new am4charts.Bullet());
    bullet.tooltipText = '{valueY}';

    const range = valueAxis.createSeriesRange(series);
    range.value = 0;
    range.endValue = -1000;
    range.contents.stroke = am4core.color('#FF0000');
    range.contents.fill = range.contents.stroke;

    // Add scrollbar
    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    chart.cursor = new am4charts.XYCursor();
  }

  async getiexSummaryData() {
    this.iexSummaryData = '';

    if (this.iexToken === '') {
      return;
    }

    // since the package isn't meant for the browser, work around its funky binding
    const fetchWrapper = (req: RequestInfo, opts: RequestInit|undefined) => fetch(req, opts);

    const iexClient = new IEXCloudClient(fetchWrapper, {
      sandbox: this.isSandbox,
      publishable: this.iexToken,
      version: 'stable',
    });

    const historicalPrices = await iexClient.symbol(this.symbol).chart('1y', { chartCloseOnly: true });
    // Get data without a client:
    //   const resp = await fetch(`https://cloud.iexapis.com/stable/stock/aapl/chart/1y?token=${this.iexToken}`);
    //   const data = await resp.json();

    this.iexSummaryData = JSON.stringify(historicalPrices, null, 2);

    this.makeSummaryChart(historicalPrices);
  }

  mounted() {
    this.getiexSummaryData();
  }
}
</script>

<style lang="scss" scoped>
  //
</style>
