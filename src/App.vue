<template>
  <v-app>
    <app-bar v-if="$store.state.config.isInitialized" />
    <v-main>
      <modal-initialize v-if="!$store.state.config.isInitialized" />
      <template v-else>
        <template v-if="!iexIndex">
          <v-container fluid>
            <v-row>
              <v-col>
                <v-sheet class="system-msgs">
                  <span>
                    A Stock Index is required. Please use SEARCH above.
                  </span>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-else>
          <template v-if="dataFetching">
            <v-container fluid>
              <v-row>
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
            </v-container>
          </template>
          <template v-else-if="dataFetchError">
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-sheet class="system-msgs">
                    <p class="error-msg">
                      {{ dataFetchErrorMsg ? dataFetchErrorMsg : 'error fetching stock data' }}
                    </p>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <router-view v-else />
        </template>
      </template>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import IEXCloudClient from 'node-iex-cloud';
import configModule from '@/store/modules/config';
import stockModule from '@/store/modules/stock-data';
import ModalInitialize from './components/modal-initialize.vue';
import AppBar from './components/app-bar.vue';

@Component({
  components: {
    ModalInitialize,
    AppBar,
  },
  props: {
    //
  },
  data: () => ({
    //
  }),
  computed: {
    iexToken: {
      get() {
        return `${configModule.iexToken}`;
      },
    },
    isSandbox: {
      get() {
        return configModule.isSandbox;
      },
    },
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
  },
})
export default class App extends Vue {
  a = '';

  checkFetchReadiness() {
    const b = this.a; // why do I have to do this to fix eslint error?

    if (configModule.iexToken
      && configModule.isSandbox !== null
      && configModule.isSandbox !== undefined
      && stockModule.iexIndex
    ) {
      // all data valid
      stockModule.mutateDataFetchError(false);
      stockModule.mutateDataFetchErrorMsg('');
    } else {
      // invalid data
      stockModule.mutateDataFetchError(true);
      stockModule.mutateDataFetchErrorMsg(
        'Missing or invalid data required to fetch stock information. Please check your config settings.',
      );
      return false;
    }

    return true;
  }

  fixHistoricalPriceDates(data: any) {
    const b = this.a;

    for (let i = 0; i < data.length; i += 1) {
      const parsedDate = new Date(data[i].date);

      Object.assign(data[i], { date: parsedDate });
    }

    return data;
  }

  async getiexSummaryData() {
    const b = this.a;

    // since the package isn't meant for the browser, work around its funky binding
    const fetchWrapper = (req: RequestInfo, opts: RequestInit|undefined) => fetch(req, opts);

    const iexClient = new IEXCloudClient(fetchWrapper, {
      sandbox: configModule.isSandbox,
      publishable: configModule.iexToken,
      version: 'stable',
    });

    // Get data without a client:
    //   const resp = await fetch(`https://cloud.iexapis.com/stable/stock/aapl/chart/1y?token=${this.iexToken}`);
    //   const data = await resp.json();

    stockModule.mutateDataFetching(true);
    stockModule.mutateDataFetchError(false);
    stockModule.mutateDataFetchErrorMsg('');

    try {
      const historicalPrices = await iexClient.symbol(stockModule.iexIndex).chart('1y', { chartCloseOnly: true });
      stockModule.mutateIexHistoricalData(
        this.fixHistoricalPriceDates(JSON.parse(JSON.stringify(historicalPrices, null, 2))),
      );

      const financials = await iexClient.symbol(stockModule.iexIndex).financials('annual'); // Financials
      stockModule.mutateIexFinancialData(JSON.parse(JSON.stringify(financials, null, 2)));

      const companyData = await iexClient.symbol(stockModule.iexIndex).company();
      stockModule.mutateIexCompanyData(JSON.parse(JSON.stringify(companyData, null, 2)));
      // JSON.stringify(companyData, null, 2)

      const newsData = await iexClient.symbol(stockModule.iexIndex).news();
      stockModule.mutateIexNewsData(JSON.parse(JSON.stringify(newsData, null, 2)));

      // TODO: need to do some handling for a lack of error but empty data results
    } catch (e) {
      // TODO: improve the error handling here. Each fetch should log its owmn error
      // including the actual error response
      stockModule.mutateDataFetchError(true);
      stockModule.mutateDataFetchErrorMsg('Failed to get stock data from server');
    }

    stockModule.mutateDataFetching(false);
  }

  async fetchStockData() {
    if (this.checkFetchReadiness()) {
      this.getiexSummaryData();
    }
  }

  @Watch('iexToken')
  onIexTokenChange() {
    this.fetchStockData();
  }

  @Watch('isSandbox')
  onIsSandboxChange() {
    this.fetchStockData();
  }

  @Watch('iexIndex')
  onIexIndexChange() {
    this.fetchStockData();
  }
}
</script>

<style lang="scss">
  @import './styles/styles.scss';

  .v-sheet {
    &.system-msgs {
      text-align: center;
      margin-top: 50px;
      color: rgba(0, 0, 0, .5);

      .v-progress-circular {
        top: 50px;
      }

      .error-msg {
        color: red;
      }
    }
  }
</style>
