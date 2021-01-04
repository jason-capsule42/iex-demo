<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    dense
    clearable
    placeholder="Index Search"
    :hide-details="true"
    :search-input.sync="search"
    return-object
    item-text="name"
    hide-no-data
    :disabled="disabled"
    color="gray"
    autofocus
    @blur="completeSearch"
  >
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <div
          class="indexSearchListItem"
          @click="updateIexIndex(item.symbol)"
        >
          <div class="indexSearchListItem-symbol">
            {{ item.symbol }}
          </div>
          <div class="indexSearchListItem-name">
            {{ item.name }}
          </div>
        </div>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import configModule from '@/store/modules/config';
import stockModule from '@/store/modules/stock-data';

@Component({
  data: () => ({
    isLoading: false,
    items: [],
    model: null,
    search: null,
    disabled: false,
  }),
  computed: {
    iextoken: {
      get() {
        return configModule.iexToken;
      },
    },
    iexIndex: {
      get() {
        return stockModule.iexIndex;
      },
      set(value) {
        stockModule.mutateIexIndex(value);
      },
    },
  },
})
export default class IndexSearch extends Vue {
  async getStockIndexes() {
    if (this.$data.items.length > 0) return;

    this.$data.isLoading = true;

    const resp = await fetch(`https://cloud.iexapis.com/stable/ref-data/symbols?token=${configModule.iexToken}`);
    this.$data.items = await resp.json()
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.$data.isLoading = false;
      });
  }

  completeSearch() {
    this.$emit('search-complete');
  }

  updateIexIndex(index: string) {
    stockModule.mutateIexIndex(index);
    this.completeSearch();
  }

  @Watch('iexToken')
  onIexTokenChange() {
    if (stockModule.iexIndex) {
      this.$data.disabled = false;
    } else {
      this.$data.disabled = true;
    }
  }

  @Watch('search')
  searchForIndexes() {
    this.getStockIndexes();
  }
}
</script>

<style lang="scss">
  .indexSearchListItem {
    display: flex;
    flex-direction: row;
  }

  .indexSearchListItem-symbol {
    width: 80px;
  }

  .indexSearchListItem-name {
    width: 415px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
