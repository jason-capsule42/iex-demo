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
import { Component, Vue } from 'vue-property-decorator';
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
}
</script>

<style lang="scss" scoped>
  .carouselChart {
    margin-bottom: 50px;
    height: calc(100% - 50px);
  }
</style>
