import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import StockData from '@/store/modules/stock-data';

test('Write and read a new value to the iexIndex', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Vuex.Store(StockData);

  expect(store.state.iexIndex).toBe('');
  store.commit('mutateIexIndex', 'new value');
  expect(store.state.iexIndex).toBe('new value');
});
