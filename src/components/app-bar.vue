<template>
  <v-app-bar
    clipped-left
    app
  >
    <v-toolbar-title>
      <v-icon left>
        mdi-chart-areaspline
      </v-icon>
      <span class="d-none d-sm-flex">
        IEX Analyzer
      </span>
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      color="transparent"
      elevation="0"
      @click="searchActive = true"
    >
      <v-icon
        v-if="!searchActive"
        small
      >
        mdi-magnify
      </v-icon>
      <index-selector
        v-if="searchActive"
        class="indexSearch"
        @search-complete="searchActive = false"
      />
    </v-btn>
    <v-list class="nav-menu">
      <template v-for="(item, idx) in navItems">
        <v-list-item
          :key="'nav' + idx"
          class="nav-bar-link"
        >
          <v-btn
            :class="['d-none d-sm-flex', {'active': $route.path === item.link}]"
            elevation="0"
            @click="navigateTo(item.link)"
          >
            <v-icon
              small
              class="d-none d-sm-flex d-md-none"
              v-text="item.icon"
            />
            <v-icon
              small
              :left="item.title != ''"
              class="d-none d-md-flex"
              v-text="item.icon"
            />
            <span
              class="d-none d-md-flex"
              v-text="item.title"
            />
          </v-btn>
        </v-list-item>
      </template>
    </v-list>
    <v-menu
      v-model="nestedMenuActive"
      :close-on-content-click="true"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="transparent"
          v-bind="attrs"
          elevation="0"
          class="d-flex d-sm-none"
          v-on="on"
        >
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
      </template>
      <v-card class="d-flex d-sm-none">
        <v-list>
          <template v-for="(item, index) in navItems">
            <v-list-item
              :key="index"
              class="nav-link"
              active-class="active"
              link
              :to="item.link"
            >
              <v-list-item-icon>
                <v-icon
                  left
                  v-text="item.icon"
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import stockModule from '@/store/modules/stock-data';
import indexSelector from './indexSelector.vue';

@Component({
  components: {
    indexSelector,
  },
  props: {
    //
  },
  data: () => ({
    //
  }),
  computed: {
    iexIndex: {
      get() {
        return `${stockModule.iexIndex}`;
      },
      set(value) {
        stockModule.mutateIexIndex(value);
      },
    },
  },
  watch: {
    //
  },
})
export default class App extends Vue {
  navItems = [
    {
      title: 'Summary',
      link: '/',
      icon: 'mdi-home',
    },
    {
      title: 'News',
      link: '/news',
      icon: 'mdi-information',
    },
    {
      title: 'Company',
      link: '/company',
      icon: 'mdi-chart-box',
    },
    {
      title: '',
      link: '/config',
      icon: 'mdi-cog',
    },
  ]

  searchActive = false;

  nestedMenuActive = false;

  navigateTo(route: string) {
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-btn {
    margin-left: 5px;
  }

  .v-toolbar__title {
    display: flex;
  }

  .v-list {
    &.nav-menu {
      display: flex;

      &.theme--light {
        background-color: unset;
        color: unset;
      }
    }
  }

  .v-list-item {
    &.nav-bar-link {
      flex: unset;
      padding: 0;

      .v-btn {
        min-width: unset;

        &.active {
          &:before {
            background-color: rgba(0, 0, 0, 0.87);
            background-color: currentColor;
            border-radius: inherit;
            bottom: 0;
            color: inherit;
            content: "";
            left: 0;
            opacity: 0;
            pointer-events: none;
            position: absolute;
            right: 0;
            top: 0;
            transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
            opacity: 0.08;
          }
        }
      }
    }
  }
</style>
