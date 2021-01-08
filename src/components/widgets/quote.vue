<template>
  <table>
    <tr>
      <td>
        <div class="dataLabel">
          Previous Close
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          Market Cap
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="dataLabel">
          Open
        </div>
        <div class="dataValue">
          <template v-if="iexQuoteData && iexQuoteData.open && iexQuoteData.open.price">
            ${{ iexQuoteData.open.price }}
          </template>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          Beta (5Y Monthly)
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="dataLabel">
          Bid
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          PE Ratio (TTM)
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="dataLabel">
          Ask
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          EPS (TTM)
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="dataLabel">
          Day's Range
        </div>
        <div class="dataValue">
          <template v-if="iexQuoteData && iexQuoteData.low && iexQuoteData.high">
            ${{ iexQuoteData.low }} - ${{ iexQuoteData.high }}
          </template>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          Earnings Date
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="dataLabel">
          52 Week Range
        </div>
        <div class="dataValue">
          <template v-if="price52WeekRange && price52WeekRange.low && price52WeekRange.high">
            ${{ price52WeekRange.low }} - ${{ price52WeekRange.high }}
          </template>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          Forward Dividend & Yield
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="dataLabel">
          Volume
        </div>
        <div class="dataValue">
          <template v-if="iexQuoteData && iexQuoteData.volume">
            {{ iexQuoteData.volume }}
          </template>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          Ex-Dividend Date
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="dataLabel">
          Avg. Volume
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
      <td>
        <div class="dataLabel">
          1y Target Est
        </div>
        <div class="dataValue">
          <span class="placeholderValue">=== Value ===</span>
        </div>
      </td>
    </tr>
    <!-- <tr>
      <td colspan="2">
        {{ iexQuoteData }}
      </td>
    </tr>
    <tr>
      <td colspan="2">
        {{ iexFinancialData }}
      </td>
    </tr> -->
  </table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';

@Component({
  components: {
    //
  },
  data: () => ({
    price52WeekRange: { low: undefined, high: undefined },
  }),
  computed: {
    iexQuoteData: {
      get() {
        return stockModule.iexQuoteData;
      },
    },
    iexFinancialData: {
      get() {
        return stockModule.iexFinancialData;
      },
    },
  },
})
export default class QuoteTable extends Vue {
  get52WeekRange() {
    this.$data.price52WeekRange.low = 12;
    this.$data.price52WeekRange.high = 43;
  }

  mounted() {
    this.get52WeekRange();
  }
}
</script>

<style lang="scss" scoped>
  .dataLabel {
    height: 1.5em;

    font-size: .65rem;
    font-weight: 600;

    text-transform: uppercase;

    color: #6a6a6a;
  }

  .dataValue {
    height: 1.5em;
  }

  table {
    width: 100%;

    border-spacing: 5px;
  }

  td {
    // background-color: aqua;
    width: 50%;

    border-bottom: 1px solid #e1e1e1;
  }

  .placeholderValue {
    font-style: italic;

    opacity: .5;
  }

</style>
