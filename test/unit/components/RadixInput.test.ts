import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RadixInput from '~/components/RadixInput.vue'
import { mount } from '@vue/test-utils'

describe('RadixInput Component', () => {
  it('expose updateRadix should work', async () => {
    const radixInputComp = await mountSuspended(RadixInput, {
      props: {
        defaultRadix: '0b',
        modelValue: '1111',
      },
    })
    const input = radixInputComp.find('.el-input__inner')
    const inputEl = input.element as HTMLInputElement

    expect(inputEl.value).toBe('1111')

    const exposed = radixInputComp.vm.$.exposed
    exposed!.updateRadix('0d')
    await nextTick()
    expect(inputEl.value).toBe('15')

    exposed!.updateRadix('0x')
    await nextTick()
    expect(inputEl.value).toBe('f')

    exposed!.updateRadix('0o')
    await nextTick()
    expect(inputEl.value).toBe('17')
  })

  // TODO: temporary use mount https://github.com/nuxt/test-utils/pull/1135

  it('multiple model value should work', async () => {
    const radixInputComp = await mount(RadixInput, {
      props: {
        defaultRadix: '0b' as const,
        modelValue: '1111',
        'onUpdate:modelValue': (e) => radixInputComp.setProps({ modelValue: e }),
        hex: 'f',
        'onUpdate:hex': (e) => radixInputComp.setProps({ hex: e }),
        decimal: '15',
        'onUpdate:decimal': (e) => radixInputComp.setProps({ decimal: e }),
      },
    })
    expect(radixInputComp.props('modelValue')).toBe('1111')
    expect(radixInputComp.props('hex')).toBe('f')
    expect(radixInputComp.props('decimal')).toBe('15')

    const input = radixInputComp.find('.el-input__inner')
    const inputEl = input.element as HTMLInputElement
    const exposed = radixInputComp.vm.$.exposed

    await input.setValue('1010')
    expect(radixInputComp.props('modelValue')).toBe('1010')
    expect(radixInputComp.props('hex')).toBe('a')
    expect(radixInputComp.props('decimal')).toBe('10')

    // 把输入框改为16进制
    exposed!.updateRadix('0x')
    await nextTick()
    expect(inputEl.value).toBe('a')
    expect(radixInputComp.props('modelValue')).toBe('a')
    await input.setValue('ff')
    expect(radixInputComp.props('modelValue')).toBe('ff')
    expect(radixInputComp.props('hex')).toBe('ff')
    expect(radixInputComp.props('decimal')).toBe('255')

    // 把输入框改为10进制
    exposed!.updateRadix('0d')
    await nextTick()
    expect(inputEl.value).toBe('255')
    expect(radixInputComp.props('modelValue')).toBe('255')
    await input.setValue('100')
    expect(radixInputComp.props('modelValue')).toBe('100')
    expect(radixInputComp.props('hex')).toBe('64')
    expect(radixInputComp.props('decimal')).toBe('100')

    // 把输入框改为2进制
    exposed!.updateRadix('0b')
    await nextTick()
    expect(inputEl.value).toBe('1100100')
    expect(radixInputComp.props('modelValue')).toBe('1100100')
    await input.setValue('111')
    expect(radixInputComp.props('modelValue')).toBe('111')
    expect(radixInputComp.props('hex')).toBe('7')
    expect(radixInputComp.props('decimal')).toBe('7')
  })

  it('fix input value should work', async () => {
    const radixInputComp = await mount(RadixInput, {
      props: {
        defaultRadix: '0b' as const,
        modelValue: '1111',
        'onUpdate:modelValue': (e) => radixInputComp.setProps({ modelValue: e }),
        hex: 'f',
        'onUpdate:hex': (e) => radixInputComp.setProps({ hex: e }),
        decimal: '15',
        'onUpdate:decimal': (e) => radixInputComp.setProps({ decimal: e }),
      },
    })
    await nextTick()
    expect(radixInputComp.props('modelValue')).toBe('1111')
    expect(radixInputComp.props('hex')).toBe('f')
    expect(radixInputComp.props('decimal')).toBe('15')

    const input = radixInputComp.find('.el-input__inner')
    // const inputEl = input.element as HTMLInputElement
    // const exposed = radixInputComp.vm.$.exposed

    // input error
    await input.setValue('aa')
    expect(radixInputComp.props('modelValue')).toBe('')
    expect(radixInputComp.props('hex')).toBe('')
    expect(radixInputComp.props('decimal')).toBe('')

    await input.setValue('a1111')
    expect(radixInputComp.props('modelValue')).toBe('1111')
    expect(radixInputComp.props('hex')).toBe('f')
    expect(radixInputComp.props('decimal')).toBe('15')
  })
})
