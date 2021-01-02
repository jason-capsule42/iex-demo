<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-sheet>
          <h1>
            {{ iexCompanyData.companyName }} ({{ iexCompanyData.symbol }})
          </h1>
          <p>
            {{ iexCompanyData.exchange }}
          </p>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-sheet
          elevation="2"
          color="white"
          height="100%"
          :min-height="chartMinHeight"
          width="100%"
          tile
        >
          <cumul-perf />
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
          :min-height="chartMinHeight"
          width="100%"
          tile
        >
          <v-carousel
            v-model="carousel"
            light
          >
            <v-carousel-item>
              <v-sheet
                color="white"
                height="100%"
                :min-height="chartMinHeight"
                width="100%"
              >
                <asset-chart class="carouselChart" />
              </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
              <v-sheet
                color="white"
                height="100%"
                :min-height="chartMinHeight"
                width="100%"
              >
                <liabilities-chart class="carouselChart" />
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-if="iexSummaryData">
      <v-col>
        <h1>IEX Summary Data</h1>
        <v-row>
          <v-col>
            <pre>
              {{ iexSummaryData }}
            </pre>
          </v-col>
          <v-col>
            <pre>
              {{ iexCompanyData }}
            </pre>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IEXCloudClient from 'node-iex-cloud';
import CumulPerf from '../components/charts/cumulative-performence.vue';
import AssetChart from '../components/charts/assets.vue';
import LiabilitiesChart from '../components/charts/liabilities.vue';

@Component({
  components: {
    CumulPerf,
    AssetChart,
    LiabilitiesChart,
  },
})
export default class Summary extends Vue {
  carousel = true;

  chartMinHeight = 400;

  iexToken = this.$store.state.config.iexToken;

  isSandbox = this.$store.state.config.isSandbox;

  symbol = this.$store.state.analyze.symbol;

  iexSummaryData = '';

  iexCompanyData = '';

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

    this.iexSummaryData = JSON.parse(JSON.stringify(historicalPrices, null, 2));

    const companyData = await iexClient.symbol(this.symbol).company();
    this.iexCompanyData = JSON.parse(JSON.stringify(companyData, null, 2));
  }

  mounted() {
    this.getiexSummaryData();
  }
}
</script>

<style lang="scss" scoped>
  .carouselChart {
    margin-bottom: 50px;
    height: calc(100% - 50px);
  }
</style>
