import {
  Module,
  VuexModule,
  Mutation,
} from 'vuex-module-decorators';

@Module
export default class ConfigModule extends VuexModule {
  public iexToken = '';

  public isSandbox = false;

  public isInitialized = false;

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
