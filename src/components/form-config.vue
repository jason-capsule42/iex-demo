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
            label="IEX Token"
            :rules="tokenRules"
            required
            @blur="updateToken"
          />
          <v-checkbox
            v-model.lazy="isSandbox"
            label="Is Sandbox"
            @click="updateSandbox"
          />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    //
  },
})
export default class FormConfig extends Vue {
  isSandbox = this.$store.state.config.isSandbox;

  iexToken = this.$store.state.config.iexToken;

  tokenRules = [
    // The two following errors should mask the actual issue for
    // improved security while still providing a helpful message
    (v: string) => (v && v.length === 35) || 'IEXToken is invalid',
    (v: string) => /^pk_/.test(v) || 'IEXToken is invalid',
  ];

  valid = true;

  updateToken() {
    // Be certain we don't store invalid form data
    if (!this.valid) {
      return;
    }
    this.$store.commit('mutateToken', this.iexToken);
  }

  updateSandbox() {
    // Be certain we don't store invalid form data
    this.$nextTick(() => {
      if (!this.valid) {
        return;
      }

      this.$store.commit('mutateSandbox', this.isSandbox);
    });
  }
}
</script>
