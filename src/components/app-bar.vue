<template>
  <v-app-bar
    clipped-left
    app
  >
    <v-toolbar-title>
      <v-icon>
        mdi-chart-areaspline
      </v-icon>
      <span class="d-none d-sm-flex">
        IEX Analyzer
      </span>
    </v-toolbar-title>
    <v-spacer />
    <v-menu
      v-model="searchActive"
      :close-on-content-click="false"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :class="['searchActivator', {'active': searchActive}]"
          color="transparent"
          v-bind="attrs"
          elevation="0"
          v-on="on"
        >
          <v-icon
            small
            left
          >
            mdi-magnify
          </v-icon>
          <span class="searchIndex">
            {{ activeSymbol === '' ? 'search' : activeSymbol }}
          </span>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="activeSymbol"
            placeholder="index"
            clearable
            counter="5"
            dense
            autofocus
            @blur="updateSymbol"
            @keydown.enter="updateSymbol"
          />
        </v-card-text>
      </v-card>
    </v-menu>
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
              left
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

@Component({
  components: {
    // ModalInitialize,
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
      title: 'Config',
      link: '/config',
      icon: 'mdi-cog',
    },
  ]

  activeSymbol = 'aapl';

  searchActive = false;

  nestedMenuActive = false;

  navigateTo(route: string) {
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }

  updateSymbol() {
    // Make sure we only update the store if the new value
    // is different than the stored value
    if (this.activeSymbol !== this.$store.state.analyze.symbol) {
      this.$store.commit('mutateSymbol', this.activeSymbol);
      this.searchActive = false;
      console.warn('updatedSymbol:', this.activeSymbol);
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

    .v-icon {
      margin-right: 5px;
    }
  }

  .v-card__text {
    width: 139px;
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

  .searchActivator {
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
        opacity: 0.4;
      }
    }
  }

  .searchIndex {
    width: 85px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-application--is-ltr {
    div.v-list-item__icon {
      &:first-child {
        margin-right: 5px;
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
