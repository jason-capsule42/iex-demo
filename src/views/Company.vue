<template>
  <v-container>
    <v-row v-if="iexCompanyData">
      <v-col>
        <h1>IEX Company Data</h1>
        <pre>
        {{ iexCompanyData }}
        </pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';

@Component({
  computed: {
    iexCompanyData: {
      get() {
        return stockModule.iexCompanyData;
      },
    },
  },
})
export default class Company extends Vue {}
</script>
