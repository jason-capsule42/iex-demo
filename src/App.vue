<template>
  <v-app>
    <AppBar />
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
import AppBar from './components/app-bar.vue';

@Component({
  components: {
    ModalInitialize,
    AppBar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
  @import './styles/styles.scss';
</style>
