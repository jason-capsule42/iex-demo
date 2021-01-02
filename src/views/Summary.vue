<template>
  <v-sheet fluid>
    <template v-if="!iexIndex">
      <span>
        A Stock Index is required. Please click the SEARCH button above.
      </span>
    </template>
    <template v-else>
      <!-- fetching state -->
      <template v-if="dataFetching">
        fetching data
        <v-progress-circular
          :size="100"
          :width="7"
          indeterminate
        />
      </template>

      <!-- complete state with errors -->
      <template v-else-if="dataFetchError">
        fetching error...
      </template>

      <!-- complete state with no errors -->
      <template v-else>
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
                <div>
                  <span :class="['closingPrice']">
                    ${{ iexClosePrice }}
                  </span>
                  <span :class="['priceChange', {'up': currentChangePrice > 0}, {'down': currentChangePrice < 0}]">
                    <v-icon v-if="currentChangePrice > 0">
                      mdi-trending-up
                    </v-icon>
                    <v-icon v-if="currentChangePrice < 0">
                      mdi-trending-down
                    </v-icon>
                    <span>
                      {{ currentChangePrice }}
                    </span>
                    <span>
                      {{ currentChangePercent }}%
                    </span>
                  </span>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-sheet
                height="100%"
                :min-height="chartMinHeight"
                width="100%"
              >
                <cumul-perf />
              </v-sheet>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-sheet
                height="100%"
                :min-height="chartMinHeight"
                width="100%"
              >
                <v-carousel
                  v-model="carousel"
                  :hide-delimiter-background="true"
                  :show-arrows-on-hover="true"
                  cycle
                  interval="10000"
                  light
                >
                  <v-carousel-item
                    transition="fade-transition"
                    reverse-transition="fade-transition"
                  >
                    <v-sheet
                      color="white"
                      height="100%"
                      :min-height="chartMinHeight"
                      width="100%"
                    >
                      <asset-chart class="carouselChart" />
                    </v-sheet>
                  </v-carousel-item>
                  <v-carousel-item
                    transition="fade-transition"
                    reverse-transition="fade-transition"
                  >
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
          <!-- <v-row>
            <v-col>
              <v-row>
                <v-col>
                  <pre>
                    {{ iexHistoricalPricesData }}
                  </pre>
                </v-col>
                <v-col>
                  <pre>
                    {{ iexCompanyData }}
                  </pre>
                </v-col>
              </v-row>
            </v-col>
          </v-row> -->
        </v-container>
      </template>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';
import CumulPerf from '../components/charts/cumulative-performence.vue';
import AssetChart from '../components/charts/assets.vue';
import LiabilitiesChart from '../components/charts/liabilities.vue';

@Component({
  components: {
    CumulPerf,
    AssetChart,
    LiabilitiesChart,
  },
  props: {
    //
  },
  data: () => ({
    chartMinHeight: 400,
    carousel: true,
  }),
  computed: {
    iexIndex: {
      get() {
        return stockModule.iexIndex;
      },
    },
    dataFetching: {
      get() {
        return stockModule.dataFetching;
      },
    },
    dataFetchError: {
      get() {
        return stockModule.dataFetchError;
      },
    },
    dataFetchErrorMsg: {
      get() {
        return stockModule.dataFetchErrorMsg;
      },
    },
    iexHistoricalPricesData: {
      get() {
        return stockModule.iexHistoricalPricesData;
      },
    },
    iexCompanyData: {
      get() {
        return stockModule.iexCompanyData;
      },
    },
    iexClosePrice: {
      get() {
        return stockModule.currentClosingPrice;
      },
    },
    currentChangePrice: {
      get() {
        return stockModule.currentChangePrice;
      },
    },
    currentChangePercent: {
      get() {
        return stockModule.currentChangePercent;
      },
    },
    // iexNewsData: {
    //   get() {
    //     return stockModule.iexNewsData;
    //   },
    // },
  },
})
export default class Summary extends Vue {}
</script>

<style lang="scss" scoped>
  .closingPrice {
    font-size: 2em;
    font-weight: 700;
  }

  .priceChange {
    &.up {
      color: green;

      .v-icon {
        color: green;
      }
    }

    &.down {
      color: red;

      .v-icon {
        color: red;
      }
    }

    span {
      margin-left: 5px;
    }
  }

  .carouselChart {
    margin-bottom: 50px;
    height: calc(100% - 50px);
  }
</style>
