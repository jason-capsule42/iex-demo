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
import { Component, Vue, Watch } from 'vue-property-decorator';
import IEXCloudClient from 'node-iex-cloud';

@Component
export default class News extends Vue {
    iexToken = this.$store.state.config.iexToken;

    isSandbox = this.$store.state.config.isSandbox;

    iexNewsData = '';

    async getiexNewsData() {
      this.iexNewsData = '';

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

      const data = await iexClient.symbol('aapl').news();

      // Get data without a client:
      //   const resp = await fetch(`https://cloud.iexapis.com/stable/stock/aapl/news?token=${this.iexToken}`);
      //   const data = await resp.json();

      this.iexNewsData = JSON.stringify(data, null, 2);
    }

    @Watch('iexToken')
    onTokenChange() {
      this.getiexNewsData();
    }

    mounted() {
      // For now - going to presume the config is always going pass a valid token and sandbox value
      // As such it should be safe to fetch data the moment the component is loaded
      this.getiexNewsData();
    }
}
</script>
