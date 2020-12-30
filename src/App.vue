<template>
  <v-app>
    <v-navigation-drawer
      v-if="$store.state.config.isInitialized"
      v-model="drawer"
      :mini-variant.sync="miniVariant"
      clipped
      app
    >
      <v-list class="pt-0">
        <template v-for="(item, idx) in navItems">
          <v-list-item
            :key="idx"
            class="nav-link"
            active-class="active"
            link
            :to="item.link"
          >
            <v-list-item-icon>
              <v-tooltip right>
                <template #activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-text="item.icon"
                  />
                </template>
                <span v-text="item.title" />
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>

          <v-divider :key="`divider-${idx}`" />
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <ModalInitialize v-if="!$store.state.config.isInitialized" />
      <v-container
        v-else
        fluid
      >
        <v-fade-transition :hide-on-leave="true">
          <router-view />
        </v-fade-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModalInitialize from './components/modal-initialize.vue';

@Component({
  components: {
    ModalInitialize,
  },
})
export default class App extends Vue {
    drawer= true;

    miniVariant = false;

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
}
</script>
