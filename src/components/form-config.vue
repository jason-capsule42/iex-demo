<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            ref="tokenInput"
            v-model.lazy="iexToken"
            class="util_input_search"
            label="IEX Token"
            :rules="tokenRules"
            clearable
            required
          />
          <v-checkbox
            v-model.lazy="isSandbox"
            label="Is Sandbox"
          />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import configModule from '@/store/modules/config';
import IndexSearch from './indexSelector.vue';

@Component({
  components: {
    IndexSearch,
  },
  data: () => ({
    //
  }),
  computed: {
    iexToken: {
      get() {
        return `${configModule.iexToken}`;
      },
      set(value) {
        configModule.mutateToken(value);
      },
    },
    isSandbox: {
      get() {
        return configModule.isSandbox;
      },
      set(value) {
        configModule.mutateSandbox(value);
      },
    },
  },
})
export default class FormConfig extends Vue {
  tokenRules = [
    // The two following errors should mask the actual issue for
    // improved security while still providing a helpful message
    (v: string) => (v && v.length === 35) || 'IEXToken is invalid',
    (v: string) => /^pk_/.test(v) || 'IEXToken is invalid',
  ];

  valid = false;
}
</script>
