<template>
  <v-container>
    <v-row>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Application Configuration</span>
          </v-card-title>
          <v-card-text>
            This web application requires the API key to be configured on first use.
            If you do not know your API key, please contact your administrator.
          </v-card-text>
          <v-card-text>
            <FormConfig />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
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
import FormConfig from './form-config.vue';

@Component({
  components: {
    FormConfig,
  },
})
export default class ModalInitialize extends Vue {
  dialog = true;

  initialize() {
    this.$store.commit('mutateInitialized', true);

    this.dialog = false;
  }
}
</script>
