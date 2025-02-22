import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RadixBox from '~/components/RadixBox.vue'

describe('RadixBox Component', () => {
  it('expose updateRadix should work', async () => {
    const radixBoxComp = await mountSuspended(RadixBox, {
      props: {
        defaultRadix: '0b',
        numData: '1111',
      },
    })
    const exposed = radixBoxComp.vm.$.exposed
    const content = radixBoxComp.find('.radix-box-content')
    const contentEl = content.element as HTMLDivElement
    expect(contentEl.innerHTML).toBe('1111')
    expect(exposed!.radixValue.value).toBe(2)

    exposed!.updateRadix('0d')
    await nextTick()
    expect(contentEl.innerHTML).toBe('15')
    expect(exposed!.radixValue.value).toBe(10)

    exposed!.updateRadix('0x')
    await nextTick()
    expect(contentEl.innerHTML).toBe('f')
    expect(exposed!.radixValue.value).toBe(16)

    exposed!.updateRadix('0o')
    await nextTick()
    expect(contentEl.innerHTML).toBe('17')
    expect(exposed!.radixValue.value).toBe(8)
  })
})
