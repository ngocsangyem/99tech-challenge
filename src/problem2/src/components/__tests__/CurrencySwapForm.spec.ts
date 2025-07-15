import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrencySwapForm from '../CurrencySwapForm.vue'

describe('CurrencySwapForm', () => {
  it('renders properly', () => {
    const wrapper = mount(CurrencySwapForm)
    expect(wrapper.text()).toContain('Currency Swap')
  })

  it('contains form elements', () => {
    const wrapper = mount(CurrencySwapForm)
    // Check if the component contains expected text or elements
    expect(wrapper.html()).toContain('From')
    expect(wrapper.html()).toContain('To')
  })
})
