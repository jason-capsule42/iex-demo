import {
  Module,
  VuexModule,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';

@Module({
  namespaced: true,
  name: 'config',
  store,
  dynamic: true,
})
class ConfigModule extends VuexModule {
  iexToken = '';

  isSandbox = false;

  isInitialized = false;

  @Mutation
  mutateToken(token: string) {
    this.iexToken = token;
  }

  @Mutation
  mutateSandbox(value: boolean) {
    this.isSandbox = value;
  }

  @Mutation
  mutateInitialized(value: boolean) {
    this.isInitialized = value;
  }
}

const configModule = getModule(ConfigModule);

export default configModule;
