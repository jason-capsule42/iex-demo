<template>
  <v-container>
    <template v-if="iexNewsData">
      <v-row
        v-for="(article, key) in iexNewsData"
        :key="key"
        class="newsRow"
      >
        <v-col class="newsCol">
          <article-min :article="article" />
        </v-col>
      </v-row>
    </template>
    <!-- <v-row v-if="iexNewsData">
      <v-col>
        <h1>IEX News Data</h1>
        <pre>
        {{ iexNewsData }}
        </pre>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';
import ArticleMin from './widgets/article-min.vue';

@Component({
  components: {
    ArticleMin,
  },
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

<style lang="scss" scoped>
.newsRow {
  .newsCol {
    padding-right: 0;
    padding-left: 0;
  }
}

</style>
