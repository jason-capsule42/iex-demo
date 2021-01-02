<template>
  <div
    ref="chart"
    class="fill-height"
    align="center"
    justify="center"
  >
    <div
      class="fill-height"
    >
      <v-progress-circular
        :size="100"
        :width="7"
        indeterminate
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  components: {
    //
  },
  computed: {
    //
  },
})
export default class WidgetCumperf extends Vue {
  charts = new Array<am4core.BaseObject>();

  makeChart(data: any) {
    const chart = am4core.create(
      this.$refs.chart as HTMLElement,
      am4charts.XYChart,
    );

    chart.paddingRight = 20;

    const chartData = [];

    for (let i = 0; i < data.length; i += 1) {
      // convert date string to date object to speed up chart perf
      // and enable chart axis grouping

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

      chartData.push({ date: data[i].date, value: cumulPerfPerc });

      this.charts.push(chart);
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

  mounted() {
    this.makeChart(stockModule.iexHistoricalPricesData);
  }

  beforeDestroy() {
    this.charts.forEach((chart) => { chart.dispose(); });
  }
}
</script>

<style lang="scss" scoped>
  //
</style>
