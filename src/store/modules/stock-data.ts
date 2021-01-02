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

  @Mutation
  mutateIexIndex(value: string) {
    this.iexIndex = value;
  }
}

const indexModule = getModule(IndexModule);

export default indexModule;
