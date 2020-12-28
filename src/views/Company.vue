<template>
  <v-container>
    <v-row>
      <v-col>
        <v-checkbox
          v-model="isSandbox"
          label="Is Sandbox"
        />
        <v-text-field
          v-model="iexToken"
          label="IEX Token"
        />
      </v-col>
    </v-row>
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import IEXCloudClient from 'node-iex-cloud';

@Component
export default class Company extends Vue {
    iexToken = '';

    iexCompanyData = '';

    isSandbox = false;

    async getiexCompanyData() {
      this.iexCompanyData = '';

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

      const data = await iexClient.symbol('aapl').company();

      // Get data without a client:
      //   const resp = await fetch(`https://cloud.iexapis.com/stable/stock/aapl/company?token=${this.iexToken}`);
      //   const data = await resp.json();

      this.iexCompanyData = JSON.stringify(data, null, 2);
    }

    @Watch('iexToken')
    onTokenChange() {
      this.getiexCompanyData();
    }
}
</script>
