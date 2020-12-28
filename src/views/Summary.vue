<template>
  <v-container>
    <v-row>
      <v-col>
        <v-checkbox
          v-model="isSandbox"
          label="Is Sandbox"
        />
        <v-text-field
          v-model="iexToken"
          label="IEX Token"
        />
      </v-col>
    </v-row>
    <v-row v-if="iexSummaryData">
      <v-col>
        <h1>IEX Summary Data</h1>
        <pre>
        {{ iexSummaryData }}
        </pre>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-sheet
          elevation="2"
          color="white"
          height="100%"
          width="100%"
          tile
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <div>Put Cumulative Performance Widget Here!</div>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="6">
        <v-sheet
          elevation="2"
          color="white"
          height="100%"
          width="100%"
          tile
        >
          <v-carousel
            v-model="carousel"
            light
          >
            <v-carousel-item>
              <v-row
                ref="chart1"
                class="fill-height"
                align="center"
                justify="center"
              >
                <div>
                  First
                </div>
              </v-row>
            </v-carousel-item>
            <v-carousel-item>
              <v-row
                ref="chart2"
                class="fill-height"
                align="center"
                justify="center"
              >
                <div>
                  Second
                </div>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import IEXCloudClient from 'node-iex-cloud';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component
export default class Summary extends Vue {
    iexToken = '';

    iexSummaryData = '';

    isSandbox = false;

    carousel = true;

    charts = new Array<am4core.BaseObject>();

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

      const historicalPrices = await iexClient.symbol('aapl').chart('1y', { chartCloseOnly: true });
      const quote = await iexClient.symbol('aapl').ohlc(); // Open/Close/High/Low/Bid/Volume/etc.
      const financials = await iexClient.symbol('aapl').financials('annual'); // Financials

      // Get data without a client:
      //   const resp = await fetch(`https://cloud.iexapis.com/stable/stock/aapl/chart/1y?token=${this.iexToken}`);
      //   const data = await resp.json();

      this.iexSummaryData = JSON.stringify(historicalPrices, null, 2);

      const assetChart = am4core.create(
        this.$refs.chart1 as HTMLElement,
        am4charts.PieChart,
      );

      assetChart.data = [{
        category: 'Current Assets',
        value: financials.financials[0].currentAssets,
      },
      {
        category: 'Future Assets',
        value: financials.financials[0].totalAssets - financials.financials[0].currentAssets,
      }];

      const assetSeries = assetChart.series.push(new am4charts.PieSeries());
      assetSeries.dataFields.category = 'name';
      assetSeries.dataFields.value = 'value';

      const liabilitiesChart = am4core.create(
        this.$refs.chart2 as HTMLElement,
        am4charts.PieChart,
      );

      liabilitiesChart.data = [{
        category: 'Long Term Debt',
        value: financials.financials[0].longTermDebt,
      },
      {
        category: 'Short Term Debt',
        value: financials.financials[0].shortTermDebt,
      }];

      const liabilitiesSeries = liabilitiesChart.series.push(new am4charts.PieSeries());
      liabilitiesSeries.dataFields.category = 'name';
      liabilitiesSeries.dataFields.value = 'value';

      this.charts.push(assetChart);
      this.charts.push(liabilitiesChart);
    }

    @Watch('iexToken')
    onTokenChange() {
      this.getiexSummaryData();
    }

    beforeDestroy() {
      this.charts.forEach((chart) => { chart.dispose(); });
    }
}
</script>
