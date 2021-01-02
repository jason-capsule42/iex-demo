<template>
  <v-container>
    <v-row v-if="iexNewsData">
      <v-col>
        <h1>IEX News Data</h1>
        <pre>
        {{ iexNewsData }}
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
    iexNewsData: {
      get() {
        return stockModule.iexNewsData;
      },
    },
  },
})
export default class News extends Vue {}
</script>
