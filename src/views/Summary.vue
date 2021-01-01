<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-sheet
          elevation="2"
          color="white"
          height="100%"
          min-height="400"
          width="100%"
          tile
        >
          <div
            id="chartdiv"
            ref="summaryChart"
            class="fill-height"
            align="center"
            justify="center"
            elevation="2"
            tile
          />
        </v-sheet>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-sheet
          elevation="2"
          color="white"
          height="100%"
          min-height="400"
          width="100%"
          tile
        >
          <v-carousel
            v-model="carousel"
            light
          >
            <v-carousel-item>
              <div
                ref="chartAsset"
                class="fill-height carouselChart"
                align="center"
                justify="center"
              />
              <div>
                First
              </div>
            </v-carousel-item>
            <v-carousel-item>
              <!-- <div
                ref="chartLiabilities"
                class="fill-height carouselChart"
                align="center"
                justify="center"
              /> -->
              <div>
                Second
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-sheet>
      </v-col>
    </v-row>
    <!-- <v-row v-if="iexSummaryData">
      <v-col>
        <h1>IEX Summary Data</h1>
        <pre>
        {{ iexSummaryData }}
        </pre>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import IEXCloudClient from 'node-iex-cloud';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { DynamicChart } from 'node-iex-cloud/lib/types';

am4core.useTheme(am4themes_animated);

@Component({
  components: {
    //
  },
})
export default class Summary extends Vue {
  iexToken = this.$store.state.config.iexToken;

  isSandbox = this.$store.state.config.isSandbox;

  symbol = this.$store.state.analyze.symbol;

  iexSummaryData = '';

  historicalPrices: DynamicChart[] = [];

  carousel = true;

  charts = new Array<am4core.BaseObject>();

  makeSummaryChart(data: any) {
    const assetChart = am4core.create(
      this.$refs.summaryChart as HTMLElement,
      am4charts.XYChart,
    );

    assetChart.paddingRight = 20;

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

    assetChart.data = chartData;

    const dateAxis = assetChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;

    const valueAxis = assetChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;

    // Create series
    const series = assetChart.series.push(new am4charts.LineSeries());
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
    assetChart.scrollbarX = scrollbarX;

    assetChart.cursor = new am4charts.XYCursor();
  }

  makeAssetChart(data: any) {
    const assetChart = am4core.create(
      this.$refs.chartAsset as HTMLElement,
      am4charts.PieChart,
    );

    assetChart.data = [{
      category: 'Current Assets',
      value: data.financials[0].currentAssets,
    },
    {
      category: 'Future Assets',
      value: data.financials[0].totalAssets - data.financials[0].currentAssets,
    }];

    const assetSeries = assetChart.series.push(new am4charts.PieSeries());
    assetSeries.dataFields.category = 'name';
    assetSeries.dataFields.value = 'value';
    assetSeries.slices.template.stroke = am4core.color('#000000');
    assetSeries.slices.template.strokeWidth = 1;
    assetSeries.slices.template.strokeOpacity = 0.5;
    assetSeries.labels.template.disabled = true;

    assetChart.legend = new am4charts.Legend();
    assetChart.legend.maxHeight = 150;
    assetChart.legend.scrollable = true;

    this.charts.push(assetChart);
  }

  makeLiabilitiesChart(data: any) {
    const liabilitiesChart = am4core.create(
      this.$refs.chartLiabilities as HTMLElement,
      am4charts.PieChart,
    );

    liabilitiesChart.data = [{
      category: 'Long Term Debt',
      value: data.financials[0].longTermDebt,
    },
    {
      category: 'Short Term Debt',
      value: data.financials[0].shortTermDebt,
    }];

    const liabilitiesSeries = liabilitiesChart.series.push(new am4charts.PieSeries());
    liabilitiesSeries.dataFields.category = 'name';
    liabilitiesSeries.dataFields.value = 'value';

    this.charts.push(liabilitiesChart);
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
    const quote = await iexClient.symbol(this.symbol).ohlc(); // Open/Close/High/Low/Bid/Volume/etc.
    const financials = await iexClient.symbol(this.symbol).financials('annual'); // Financials

    // Get data without a client:
    //   const resp = await fetch(`https://cloud.iexapis.com/stable/stock/aapl/chart/1y?token=${this.iexToken}`);
    //   const data = await resp.json();

    this.iexSummaryData = JSON.stringify(historicalPrices, null, 2);

    this.makeSummaryChart(historicalPrices);
    this.makeAssetChart(financials);
    // this.makeLiabilitiesChart(financials);
  }

  // @Watch('token')
  // tokenWatch(newToken: string, oldToken: string) {
  //   this.getiexSummaryData();
  //   console.warn('iexToken updated', newToken, oldToken);
  // }

  mounted() {
    // For now - going to presume the config is always going pass a valid token and sandbox value
    // As such it should be safe to fetch data the moment the component is loaded
    this.getiexSummaryData();
  }

  beforeDestroy() {
    this.charts.forEach((chart) => { chart.dispose(); });
  }
}
</script>

<style lang="scss" scoped>
  .carouselChart {
    margin-bottom: 50px;
    height: calc(100% - 50px);
  }
</style>
