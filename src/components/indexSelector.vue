<template>
  <div class="searchWrapper">
    <v-autocomplete
      v-model="model"
      :disabled="disabled"
      :items="items"
      :search-input.sync="search"
      :filter="filterObject"
      :hide-details="true"
      no-data-text="Begin typing to search"
      item-text="name"
      placeholder="Quote Lookup"
      background-color="transparent"
      color="gray"
      return-object
      dense
      clear-icon="mdi-magnify"
      @blur="completeSearch"
    >
      <template v-slot:item="{ item }">
        <v-list-item-content @click="updateIexIndex(item.symbol)">
          <div
            class="indexSearchListItem"
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
    <div class="customIcon">
      <v-icon>
        mdi-magnify
      </v-icon>
    </div>
  </div>
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

  filterObject(item: any, queryText: any) {
    const a = this.$data.isLoading;

    return (
      item.symbol.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
      || item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
    );
  }

  completeSearch() {
    this.$emit('search-complete');
    this.$data.model = null;
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
  @import '../styles/_variables.scss';

  .searchWrapper {
    height: 31px;

    .v-text-field.v-input--dense:not(.v-text-field--outlined) input[type='text'] {
      padding: 3px 10px;

      font-size: .9em;
      line-height: 25px;
    }

    .v-text-field {
      margin-top: 0;
    }

    .v-text-field div.v-input__append-inner {
      display: none;
    }

    .v-input__slot {
      &:before,
      &:after {
        display: none;
      }
    }
  }

  .v-menu__content {
    max-width: 300px !important;

    transform: translateY(5px);

    border-width: 1px;
    border-style: solid;
    border-color: $border-color;
  }

  .indexSearchListItem {
    display: flex;
    flex-direction: row;

    width: 100%;
    height: 100%;
  }

</style>

<style lang="scss" scoped>
  $border-color: rgba(0, 0, 0, .6);

  .searchWrapper {
    display: flex;
    flex-direction: row;
  }

  .v-input {
    flex: 1;
  }

  .customIcon {
    position: absolite;
    top: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 5px;

    background-color: $border-color;

    i {
      color: white;
    }
  }

  .indexSearch {
    border-width: 1px;
    border-style: solid;
    border-color: $border-color;
  }

  .v-list.v-select-list {
    padding: 0;
  }

  .indexSearchListItem-symbol {
    width: 80px;
  }

  .indexSearchListItem-name {
    overflow: hidden;

    width: calc(100% - 80px);

    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>
