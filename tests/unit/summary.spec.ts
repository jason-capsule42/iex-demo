import { shallowMount } from '@vue/test-utils';
import QuoteComp from '@/components/widgets/quote.vue';

describe('quote.vue', () => {
  it('renders index required message when passed', () => {
    const msg = '52 Week Range';
    const wrapper = shallowMount(QuoteComp, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
