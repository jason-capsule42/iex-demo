<template>
  <v-container>
    <v-row>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600"
      >
        <v-card>
          <v-card-title class="text-center">
            <v-icon>
              mdi-chart-areaspline
            </v-icon>
            <span class="headline">IEX Analyzer Configuration</span>
          </v-card-title>
          <v-card-text class="text-center">
            <p>
              This web application requires the API key and a stock index to be configured.
            </p>
            <p>
              If you do not know your API key, please contact your administrator.
            </p>
          </v-card-text>
          <v-card-text>
            <form-config />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <!-- TODO: this needs to be improved to disable if the form has errors -->
            <v-btn
              color="success"
              :disabled="!iexIndex || !iexToken || isSandbox === null || isSandbox === undefined"
              @click="initialize"
            >
              close
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import configModule from '@/store/modules/config';
import stockModule from '@/store/modules/stock-data';
import FormConfig from './form-config.vue';

@Component({
  components: {
    FormConfig,
  },
  computed: {
    iexToken: {
      get() {
        return `${configModule.iexToken}`;
      },
    },
    isSandbox: {
      get() {
        return configModule.isSandbox;
      },
    },
    iexIndex: {
      get() {
        return `${stockModule.iexIndex}`;
      },
    },
  },
})
export default class ModalInitialize extends Vue {
  dialog = true;

  initialize() {
    configModule.mutateInitialized(true);

    this.dialog = false;
  }
}
</script>

<style lang="scss" scoped>
  .v-icon {
    margin-right: 5px;
  }

  .v-card__title {
    display: block;
  }
</style>
