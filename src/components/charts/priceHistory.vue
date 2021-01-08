<template>
  <v-container
    class="fill-height chartPriceHistory"
  >
    <v-row class="headerRow">
      <v-col class="headerCol">
        <h3>
          Price History
        </h3>
      </v-col>
    </v-row>
    <div
      ref="chart"
      align="center"
      justify="center"
      class="fill-height chartWrapper"
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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  components: {
    //
  },
  data: () => ({
    earliestDate: undefined,
    latestDate: undefined,
    startDate: undefined,
    endDate: undefined,
  }),
  computed: {
    //
  },
})
export default class PriceHistory extends Vue {
  charts = new Array<am4core.BaseObject>();

  makeChart(data: any) {
    const chart = am4core.create(
      this.$refs.chart as HTMLElement,
      am4charts.XYChart,
    );

    chart.paddingRight = 20;

    const chartData = [];

    for (let i = 0; i < data.length; i += 1) {
      chartData.push({ date: data[i].date, value: data[i].close });

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
    series.fillOpacity = 0.3;

    valueAxis.renderer.inside = true;
    valueAxis.renderer.minLabelPosition = 0.05;
    valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.renderer.fontSize = 9;
    dateAxis.renderer.inside = true;
    dateAxis.renderer.minLabelPosition = 0.05;
    dateAxis.renderer.maxLabelPosition = 0.95;
    dateAxis.renderer.fontSize = 9;

    // add bullet
    const bullet = series.bullets.push(new am4charts.Bullet());
    bullet.tooltipText = '{valueY}%';

    const range = valueAxis.createSeriesRange(series);
    range.contents.stroke = am4core.color('#FF0000');
    range.contents.fill = range.contents.stroke;
    range.contents.fillOpacity = 0.3;

    chart.margin(0, 0, 0, 0);
    chart.padding(0, 0, 0, 0);

    chart.cursor = new am4charts.XYCursor();
  }

  mounted() {
    this.makeChart(stockModule.iexHistoricalPricesData);
  }

  beforeDestroy() {
    this.charts.forEach((chart) => { chart.dispose(); });
  }

  @Watch('startDate')
  filterByStartDate() {
    const a = this.$data.earliestDate;
    console.warn('filtering by start date');

    // add functional filtering by date
  }

  @Watch('endDate')
  filterByendDate() {
    const a = this.$data.earliestDate;
    console.warn('filtering by end date');

    // add functional filtering by date
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/_variables.scss';

  .chartPriceHistory {
    padding: 0;
  }

  .v-list {
    padding: 0 0 0 0;
  }

  .chartWrapper {
    position: relative;

    width: 100%;

    &:after {
      position: absolute;
      top: 0;
      left: 0;

      display: block;

      width: 100%;
      height: 100%;

      content: '';
      pointer-events: none;

      border: solid 1px rgba(0, 0, 0, .25);
      border-top: 0;
    }
  }

  .headerRow {
    height: 26px;
    margin: 0;
    padding: 0;

    font-size: .9em;
    font-weight: 700;

    border-bottom: solid 2px $border-color;
    background-color: $nav-bg-color;
  }

  .headerCol {
    padding: 0;
  }

  .dateCol {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;

    margin-bottom: 10px;
  }

  .v-btn:not(.v-btn--round).v-size--default {
    height: unset;
    height: 23px;
    margin-left: 5px;
    padding: 3px 6px;

    font-size: .8em;

    color: rgba(0, 0, 0, .5);
    border-width: 1px;
    border-style: solid;
    border-color: $border-color !important;
    border-radius: 0;
    background-color: rgba(0, 0, 0, .05) !important;
  }

  .rangeLabel {
    font-size: .8em;
    font-weight: bold;

    white-space: nowrap;
  }

  .divider {
    margin-left: 5px;

    font-size: .8em;
  }

  .v-menu__content,
  .v-sheet.v-card {
    border-radius: 0;
  }

  .v-list {
    border-radius: 0;
  }

  .v-picker {
    border-radius: 0;
  }

</style>
