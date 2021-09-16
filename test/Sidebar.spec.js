import { mount } from '@vue/test-utils'
import Sidebar from '@/components/sidebar.vue'

describe('Sidebar', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Sidebar)
    expect(wrapper.vm).toBeTruthy()
  })
})
