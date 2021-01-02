import Vue from 'vue';
import Vuex from 'vuex';

import ConfigureModule from './modules/configure';
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
    config: ConfigureModule,
    analyze: AnalyzeModule,
  },
});
