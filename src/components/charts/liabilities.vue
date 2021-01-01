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

  charts = new Array<am4core.BaseObject>();

  makeChart(data: any) {
    const chart = am4core.create(
      this.$refs.chart as HTMLElement,
      am4charts.PieChart,
    );

    chart.data = [{
      category: 'Long Term Debt',
      value: data.financials[0].longTermDebt,
    },
    {
      category: 'Short Term Debt',
      value: data.financials[0].shortTermDebt,
    }];

    const liabilitiesSeries = chart.series.push(new am4charts.PieSeries());
    liabilitiesSeries.dataFields.category = 'name';
    liabilitiesSeries.dataFields.value = 'value';
    liabilitiesSeries.slices.template.stroke = am4core.color('#000000');
    liabilitiesSeries.slices.template.strokeWidth = 1;
    liabilitiesSeries.slices.template.strokeOpacity = 0.5;
    liabilitiesSeries.labels.template.disabled = true;

    chart.legend = new am4charts.Legend();
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;

    this.charts.push(chart);
  }

  async getiexSummaryData() {
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

    const financials = await iexClient.symbol(this.symbol).financials('annual'); // Financials

    // Get data without a client:
    //   const resp = await fetch(`https://cloud.iexapis.com/stable/stock/aapl/chart/1y?token=${this.iexToken}`);
    //   const data = await resp.json();

    this.makeChart(financials);
  }

  mounted() {
    this.getiexSummaryData();
  }

  beforeDestroy() {
    this.charts.forEach((chart) => { chart.dispose(); });
  }
}
</script>

<style lang="scss" scoped>
  //
</style>
