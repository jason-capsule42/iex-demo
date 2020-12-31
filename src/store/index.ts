import Vue from 'vue';
import Vuex from 'vuex';

import ConfigModule from './modules/config';
import AnalyzeModule from './modules/analyze';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    config: ConfigModule,
    analyze: AnalyzeModule,
  },
});
