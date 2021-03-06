<template>
  <v-container
    class="fill-height chartCumulPerf"
  >
    <v-row class="headerRow">
      <v-col>
        <h3>
          Cumulative Performance
        </h3>
      </v-col>
      <v-col class="dateCol">
        <span class="rangeLabel">
          Date Range:
        </span>
        <v-menu
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="rgba(0, 0, 0, .1)"
              elevation="0"
              v-bind="attrs"
              v-on="on"
            >
              {{ startDate }}
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-date-picker
                v-model="startDate"
                :min="earliestDate"
                :max="latestDate"
              />
            </v-list>
          </v-card>
        </v-menu>
        <span class="divider">
          to
        </span>
        <v-menu
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="rgba(0, 0, 0, .1)"
              elevation="0"
              v-bind="attrs"
              v-on="on"
            >
              {{ endDate }}
            </v-btn>
          </template>
          <v-list>
            <v-date-picker
              v-model="endDate"
              :min="earliestDate"
              :max="latestDate"
            />
          </v-list>
        </v-menu>
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
export default class WidgetCumperf extends Vue {
  charts = new Array<am4core.BaseObject>();

  getEarliestDate() {
    this.$data.startDate = '';
  }

  makeChart(data: any) {
    const chart = am4core.create(
      this.$refs.chart as HTMLElement,
      am4charts.XYChart,
    );

    chart.paddingRight = 20;

    const chartData = [];

    let todayPerf = 0;
    // let yesterdayPerf = 0;
    let yesterdayCumulPerf = 0;
    let cumulPerf = 0;
    let cumulPerfPerc = 0;

    for (let i = 0; i < data.length; i += 1) {
      // yesterdayPerf = todayPerf;

      if (i > 0) {
        todayPerf = data[i].close / data[i - 1].close;

        if (i > 1) {
          yesterdayCumulPerf = cumulPerf;
          cumulPerf = yesterdayCumulPerf * todayPerf;
        } else {
          cumulPerf = todayPerf;
        }

        if (i > 0) {
          cumulPerfPerc = cumulPerf - 1;
        }
      }

      if (i > 0) {
        chartData.push({ date: data[i].date, value: cumulPerfPerc }); // cumulPerfPerc
      }

      if (!this.$data.earliestDate || this.$data.earliestDate > data[i].date) {
        this.$data.earliestDate = data[i].date;
      }

      if (!this.$data.latestDate || this.$data.latestDate < data[i].date) {
        this.$data.latestDate = data[i].date;
      }

      this.charts.push(chart);
    }

    // Get date parts w 2 digit month and day
    const eYear = this.$data.earliestDate.getUTCFullYear();
    const eMonth = ('0' + (this.$data.earliestDate.getUTCMonth() + 1)).slice(-2); /* eslint-disable-line */
    const eDay = ('0' + (this.$data.earliestDate.getUTCDate())).slice(-2); /* eslint-disable-line */

    // convert the saved calendar dates to strings so that date picker can use them
    this.$data.earliestDate = eYear.toString()
      .concat('-', eMonth.toString(), '-', eDay.toString());

    // Get date parts w 2 digit month and day
    const lYear = this.$data.latestDate.getUTCFullYear();
    const lMonth = ('0' + (this.$data.latestDate.getUTCMonth() + 1)).slice(-2); /* eslint-disable-line */
    const lDay = ('0' + (this.$data.latestDate.getUTCDate())).slice(-2); /* eslint-disable-line */

    // convert the saved calendar dates to strings so that date picker can use them
    this.$data.latestDate = lYear.toString()
      .concat('-', lMonth.toString(), '-', lDay.toString());

    this.$data.startDate = this.$data.earliestDate;
    this.$data.endDate = this.$data.latestDate;

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
    range.value = 0;
    range.endValue = -1000;
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
    // console.warn('filtering by start date');

    // add functional filtering by date
  }

  @Watch('endDate')
  filterByendDate() {
    const a = this.$data.earliestDate;
    // console.warn('filtering by end date');

    // add functional filtering by date
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/_variables.scss';

  .chartCumulPerf {
    position: relative;

    width: 100%;

    &:after {
      position: absolute;
      top: 0;
      left: 0;

      display: block;

      width: 100%;
      height: calc(100% + 24px);

      content: '';
      pointer-events: none;

      border: solid 1px rgba(0, 0, 0, .25);
      border-top: 0;
    }
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
      height: calc(100% + 24px);

      content: '';
      pointer-events: none;

      border-top: solid 1px rgba(0, 0, 0, .25);
    }
  }

  .headerRow {
    height: 60px;
    margin-right: 0;
    margin-left: 0;
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
