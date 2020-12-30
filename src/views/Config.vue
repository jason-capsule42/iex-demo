<template>
  <v-container>
    <v-row>
      <v-col>
        <FormConfig />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormConfig from '../components/form-config.vue';

@Component({
  components: {
    FormConfig,
  },
})
export default class Config extends Vue {}
</script>
