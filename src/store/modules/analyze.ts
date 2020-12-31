import {
  Module,
  VuexModule,
  Mutation,
} from 'vuex-module-decorators';

@Module
export default class AnalyzeModule extends VuexModule {
  public symbol = '';

  @Mutation
  mutateSymbol(data: string) {
    this.symbol = data;
  }
}
