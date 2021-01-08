<template>
  <v-container fluid>
    <v-row class="headerRow">
      <v-col
        cols="12"
        class="headerContent"
      >
        <div class="indexLabeling">
          <template v-if="iexCompanyData.length > 0">
            <h2>
              {{ iexCompanyData.companyName }} ({{ iexCompanyData.symbol }})
            </h2>
            <div class="exchangeMarket">
              {{ iexCompanyData.exchange }}
            </div>
          </template>
        </div>
        <index-selector class="indexSearch" />
      </v-col>
    </v-row>
    <v-row v-if="!iexIndex">
      <v-col>
        <v-sheet class="system-msgs">
          <span>
            A Stock Index is required. Please use Quote Lookup.
          </span>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-else-if="dataFetching">
      <v-col>
        <v-sheet class="system-msgs">
          <v-progress-circular
            :size="100"
            :width="7"
            indeterminate
          />
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-else-if="dataFetchError">
      <v-col>
        <v-sheet class="system-msgs">
          <p class="error-msg">
            {{ dataFetchErrorMsg ? dataFetchErrorMsg : 'error fetching stock data' }}
          </p>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="4">
        <v-sheet>
          <div class="sectionHead">
            <div class="overviewWrapper">
              <div class="currencySymbol">
                $
              </div>
              <div :class="['closingPrice']">
                {{ iexClosePrice }}
              </div>
              <div :class="['priceChange', {'up': currentChangePrice > 0}, {'down': currentChangePrice < 0}]">
                <div>
                  <v-icon v-if="currentChangePrice > 0">
                    mdi-trending-up
                  </v-icon>
                  <v-icon v-if="currentChangePrice < 0">
                    mdi-trending-down
                  </v-icon>
                </div>
                <div>
                  {{ currentChangePrice }}
                </div>
                <div>
                  {{ currentChangePercent }}%
                </div>
              </div>
            </div>
          </div>
          <quote-table />
        </v-sheet>
      </v-col>
      <v-col cols="8">
        <v-sheet>
          <div class="sectionHead">
            <div class="sectionNav">
              <div
                :class="['sectionItem', {'active': activeTab === 'performance'}]"
                @click="setSectionTab('performance')"
              >
                performance
              </div>
              <div
                :class="['sectionItem', {'active': activeTab === 'charts'}]"
                @click="setSectionTab('charts')"
              >
                charts
              </div>
            </div>
          </div>
          <v-sheet>
            <template v-if="activeTab === 'performance'">
              <cumul-perf />
            </template>
            <template v-if="activeTab === 'charts'">
              <v-carousel
                v-model="carousel"
                :hide-delimiter-background="true"
                :show-arrows-on-hover="true"
                :height="400"
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
            </template>
          </v-sheet>
        </v-sheet>
        <v-sheet>
          <div class="sectionHead" />
        </v-sheet>
        <news-block />
      </v-col>
    </v-row>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!-- <v-row>
      <v-col
        col="12"
        class="topSection"
      >
        <div class="contentBrief">
          <div class="briefDivider">
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
          </div>
          <quote-table />
        </div>
        <div class="sections">
          <div class="sectionsNavWrapper">
            <div class="sectionNav">
              <div
                :class="['sectionItem', {'active': activeTab === 'summary'}]"
                @click="setSectionTab('summary')"
              >
                Summary
              </div>
              <div
                :class="['sectionItem', {'active': activeTab === 'charts'}]"
                @click="setSectionTab('charts')"
              >
                Charts
              </div>
              <div
                :class="['sectionItem', {'active': activeTab === 'news'}]"
                @click="setSectionTab('news')"
              >
                News
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
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
        v-if="iexHistoricalPricesData"
        cols="12"
        :md="iexHistoricalPricesData ? 6 : 12"
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
    <v-row>
      <v-col>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <quote-table />
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
  </v-container>
  <!-- </v-sheet> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';
import IndexSelector from '../components/indexSelector.vue';
import CumulPerf from '../components/charts/cumulative-performence.vue';
import AssetChart from '../components/charts/assets.vue';
import LiabilitiesChart from '../components/charts/liabilities.vue';
import QuoteTable from '../components/widgets/quote.vue';
import NewsBlock from '../components/newsBlock.vue';

@Component({
  components: {
    IndexSelector,
    CumulPerf,
    AssetChart,
    LiabilitiesChart,
    QuoteTable,
    NewsBlock,
  },
  props: {
    //
  },
  data: () => ({
    chartMinHeight: 400,
    carousel: true,
    activeTab: 'performance',
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
        return stockModule.currentClosingData.close;
      },
    },
    currentChangePrice: {
      get() {
        return stockModule.currentChangePrice.toFixed(2);
      },
    },
    currentChangePercent: {
      get() {
        return stockModule.currentChangePercent.toFixed(2);
      },
    },
  },
})
export default class Summary extends Vue {
  setSectionTab(tab: string) {
    this.$data.activeTab = tab;
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/_variables.scss';

  .sectionHead {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    height: 35px;

    border-color: $border-color;
    border-bottom-width: 2px;
    border-bottom-style: solid;
  }

  .overviewWrapper {
    display: flex;
    flex-direction: row;

    font-weight: 700;

    > div {
      height: 35px;

      &.currencySymbol {
        padding-top: 2px;

        font-size: .8em;
      }

      &.closingPrice {
        margin-right: 10px;

        line-height: 35px;
      }

      &.priceChange {
        display: flex;
        align-items: flex-end;
        flex-direction: row;

        padding-bottom: 2px;

        font-size: .85em;

        > div {
          &:not(:last-child) {
            margin-right: 5px;
          }
        }

        .v-icon {
          font-size: 1.3em;
        }

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
    }
  }

  .sectionNav {
    display: flex;
    flex-direction: row;

    height: 26px;

    background-color: $nav-bg-color;

    .sectionItem {
      display: flex;
      align-items: center;

      height: 100%;
      padding: 0 15px;

      font-size: .9em;
      font-weight: 700;

      text-transform: uppercase;

      &:not(.active) {
        cursor: pointer;

        &:hover {
          background-color: darken($nav-bg-color, 15%);
        }
      }

      &.active {
        color: $nav-color-active;
        background-color: $nav-bg-color-active;
      }
    }
  }

  .chartCumulPerf {
    height: 380px;
    margin-bottom: 20px;
    padding-right: 0;
    padding-left: 0;
  }

  /////////////

  .row.headerRow:not(:last-child) {
    margin-bottom: 0;
  }

  .headerContent {
    display: flex;
    flex-direction: row;

    width: 100%;

    .indexLabeling {
      flex: 1;

      .exchangeMarket {
        font-size: .8em;
      }
    }

    .indexSearch {
      width: 300px;
      margin-left: 20px;
    }
  }

  .topSection {
    display: flex;
    flex-direction: row;
  }

  // .briefDivider,
  // .sectionNav {
  //   border-bottom-style: solid;
  //   border-bottom-width: 2px;
  //   border-color: $border-color;
  // }

  .briefDivider {
    height: 50px;
  }

  .contentBrief {
    width: 350px;
    margin-right: 20px;

    // .briefDivider {
    //   height: 29px;
    // }
  }

  .sections {
    flex: 1;
  }

  .sectionsNavWrapper {
    height: 50px;
    padding-top: 19px;
  }

  //////////

  .row {
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }

  .closingPrice {
    font-size: 2em;
    font-weight: 700;
  }

  .carouselChart {
    display: flex;
    flex-direction: column;

    height: calc(100% - 50px);
    margin-bottom: 50px;
    padding-right: 0;
    padding-left: 0;
  }

</style>
