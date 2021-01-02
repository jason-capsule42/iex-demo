import {
  Module,
  VuexModule,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';

@Module({
  namespaced: true,
  name: 'index',
  store,
  dynamic: true,
})
class IndexModule extends VuexModule {
  iexIndex = '';

  dataFetching = false;

  dataFetchError = false;

  dataFetchErrorMsg = '';

  iexHistoricalPricesData = '';

  iexFinancialData = {};

  iexCompanyData = {};

  iexNewsData = '';

  @Mutation
  mutateIexIndex(value: string) {
    this.iexIndex = value;
  }

  @Mutation
  mutateDataFetching(value: boolean) {
    this.dataFetching = value;
  }

  @Mutation
  mutateDataFetchError(value: boolean) {
    this.dataFetchError = value;
  }

  @Mutation
  mutateDataFetchErrorMsg(value: string) {
    this.dataFetchErrorMsg = value;
  }

  @Mutation
  mutateIexHistoricalData(value: string) {
    this.iexHistoricalPricesData = value;
  }

  @Mutation
  mutateIexFinancialData(value: string) {
    this.iexFinancialData = value;
  }

  @Mutation
  mutateIexCompanyData(value: string) {
    this.iexCompanyData = value;
  }

  @Mutation
  mutateIexNewsData(value: string) {
    this.iexNewsData = value;
  }
}

const indexModule = getModule(IndexModule);

export default indexModule;
