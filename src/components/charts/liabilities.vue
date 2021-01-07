<template>
  <v-container>
    <v-row class="headerRow">
      <v-col>
        <h3>
          Liability Debt
        </h3>
      </v-col>
    </v-row>
    <v-row class="contentRow">
      <v-col>
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
      </v-col>
    </v-row>
  </v-container>
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

  mounted() {
    this.makeChart(stockModule.iexFinancialData);
  }

  beforeDestroy() {
    this.charts.forEach((chart) => { chart.dispose(); });
  }
}
</script>

<style lang="scss" scoped>
  .headerRow {
    height: 60px;
    margin-right: 0;
    margin-left: 0;
  }

  .contentRow {
    height: 100%;
  }

</style>
