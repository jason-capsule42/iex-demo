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
        am4charts.PieChart,
    );

    chart.data = [{
      category: 'Current Assets',
      value: data.financials[0].currentAssets,
    },
    {
      category: 'Future Assets',
      value: data.financials[0].totalAssets - data.financials[0].currentAssets,
    }];

    const assetSeries = chart.series.push(new am4charts.PieSeries());
    assetSeries.dataFields.category = 'name';
    assetSeries.dataFields.value = 'value';
    assetSeries.slices.template.stroke = am4core.color('#000000');
    assetSeries.slices.template.strokeWidth = 1;
    assetSeries.slices.template.strokeOpacity = 0.5;
    assetSeries.labels.template.disabled = true;

    chart.legend = new am4charts.Legend();
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;

    this.charts.push(chart);
  }

  mounted() {
    this.makeChart(stockModule.iexFinancialData);
  }

  beforeDestroy() {
    this.charts.forEach((chart) => { chart.dispose(); });
  }
}
</script>

<style lang="scss" scoped>
</style>
