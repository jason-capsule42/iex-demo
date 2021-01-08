<template>
  <v-container class="companyInfo">
    <template v-if="iexCompanyData">
      <v-row>
        <v-col>
          <div class="name">
            {{ iexCompanyData.companyName }}
          </div>
          <div class="address">
            <div>
              {{ iexCompanyData.address }}
            </div>
            <div v-if="iexCompanyData.address2">
              {{ iexCompanyData.address2 }}
            </div>
            <div>
              {{ iexCompanyData.city }}, {{ iexCompanyData.state }} {{ iexCompanyData.zip }}
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="iexCompanyData.website">
        <v-col>
          <a
            class="website inherit"
            :href="iexCompanyData.website"
            target="_blank"
          >
            {{ iexCompanyData.website }}
          </a>
        </v-col>
      </v-row>
      <v-row v-if="iexCompanyData.phone">
        <v-col>
          <div class="label">
            phone
          </div>
          <div class="value">
            <a
              :href="'tel:' + phoneStr"
              class="website inherit"
            >
              {{ phoneStr }}
            </a>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="iexCompanyData.industry">
        <v-col>
          <div class="label">
            industry
          </div>
          <div class="value">
            {{ iexCompanyData.industry }}
          </div>
        </v-col>
      </v-row>
      <v-row v-if="iexCompanyData.CEO">
        <v-col>
          <div class="label">
            CEO
          </div>
          <div class="value">
            {{ iexCompanyData.CEO }}
          </div>
        </v-col>
      </v-row>
      <v-row v-if="iexCompanyData.employees">
        <v-col>
          <div class="label">
            employees
          </div>
          <div class="value">
            {{ iexCompanyData.employees }}
          </div>
        </v-col>
      </v-row>
    </template>
    <!-- <v-row v-if="iexCompanyData">
      <v-col>
        <h1>IEX News Data</h1>
        <pre>
        {{ iexCompanyData }}
        </pre>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';

@Component({
  components: {
    //
  },
  data: () => ({
    phoneStr: 'fsdafsa',
  }),
  computed: {
    iexCompanyData: {
      get() {
        return stockModule.iexCompanyData;
      },
    },
  },
})
export default class News extends Vue {
  generatePhoneStr() {
    const phone = stockModule.iexCompanyData.phone.toString();
    const cleaned = (phone).replace(/\D/g, '');

    // Check if the input is of correct
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      // Remove the matched extension code
      // Change this to format for any country code.
      const intlCode = (match[1] ? '+1 ' : '');
      this.$data.phoneStr = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
  }

  mounted() {
    this.generatePhoneStr();
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/_variables.scss';

  .companyInfo {
    padding-top: 15px;
    padding-bottom: 15px;

    background-color: $nav-bg-color;
  }

  .sectionTitle {
    padding-top: 3px;
    padding-bottom: 3px;

    font-size: .8em;
    font-weight: 700;

    text-transform: uppercase;

    color: $nav-color-active;
    background-color: $color-primary;
  }

  .name {
    margin-bottom: 10px;

    font-size: 1.5em;
    font-weight: 700;
  }

  a.inherit {
    text-decoration: none;

    color: rgba(0, 0, 0, .87);

    &:hover {
      color: #3677a8;
    }
  }

  .website {
    display: inline-block;

    margin: 5px 0;

    font-size: .9em;
  }

  .label {
    display: block;

    margin: 0 0 2px 0;
    padding-top: 8px;

    font: 400 .64286rem/.9 Lato,sans-serif;

    letter-spacing: .025em;
    text-transform: uppercase;

    color: #6a6a6a;
  }

  .value {
    padding-bottom: 8px;

    line-height: 1.2em;

    border-bottom: solid 1px lighten($border-color, 80%);
  }

  .col {
    padding-top: 5px;
    padding-bottom: 11px;
  }

</style>
