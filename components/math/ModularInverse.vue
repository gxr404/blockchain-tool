<script setup lang="ts">
import type { RadixInput } from '#components'
import BigNumber from 'bignumber.js'

type RadixInputType = InstanceType<typeof RadixInput>

const number = ref('')
const modulus = ref('')
const numberInputRef = ref<RadixInputType>()
const modulusInputRef = ref<RadixInputType>()
const hasErr = ref(false)
const errMsg = ref('')

const numberDecimal = computed(() => {
  if (!numberInputRef.value || !number.value) return ''
  const radix = numberInputRef.value.radixValue
  let _number = number.value
  if (radix !== 10) {
    _number = BigNumber(_number, radix).toString(10)
  }
  return _number
})

const modulusDecimal = computed(() => {
  if (!modulusInputRef.value || !modulus.value) return ''
  const radix = modulusInputRef.value.radixValue
  let _number = modulus.value
  if (radix !== 10) {
    _number = BigNumber(_number, radix).toString(10)
  }
  return _number
})

const inverse = computed(() => {
  resetErr()
  if (!numberDecimal.value || !modulusDecimal.value) return ''
  const { gcd: gcdV, s } = gcd(numberDecimal.value, modulusDecimal.value, true)
  if (gcdV !== '1') {
    hasErr.value = true
    errMsg.value = 'number 和 modulus 需互为素数!'
    return ''
  }
  return s || ''
})

function resetErr() {
  hasErr.value = false
  errMsg.value = ''
}
</script>

<template>
  <content-card title="乘法逆元" sub-title="(Modular Inverse)">
    <template #description>
      <div class="text-sm text-gray-400 mt-[10px]">
        如果一个线性同余方程
        <katex class="katex-sm" formula=" ax \equiv 1 (\bmod b) \iff ax \bmod b = 1 \bmod b" />，则
        x 称为
        <katex class="katex-sm" formula="a \bmod b" />
        的逆元，记作<katex class="katex-sm" formula="a^{-1}" />
      </div>
      <div class="text-sm text-gray-400 mt-[10px]">
        乘法逆元的作用:
        在模运算下<b>无法直接执行除法</b>(直接乘法可能出现小数)，所以在模运算下乘上<b>逆元</b>就相当于除以了一个数
      </div>
      <div class="text-sm text-gray-400">
        例:
        <katex
          class="katex-sm"
          formula="a/x \equiv d \bmod m \iff a \times x^{-1} = d \bmod m \iff a \times x\text{的逆元} = d \bmod m"
        />
      </div>
    </template>

    <div class="pt-6">
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="Number: ">
          <div class="inline-block w-[660px]">
            <radix-input
              :class="hasErr ? 'error' : ''"
              default-radix="0d"
              v-model="number"
              ref="numberInputRef"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Modulus模数: ">
          <div class="inline-block w-[660px]">
            <radix-input
              :class="hasErr ? 'error' : ''"
              default-radix="0d"
              v-model="modulus"
              ref="modulusInputRef"
            />
          </div>
          <div class="mt-[12px] pr-[12px] w-full" v-if="hasErr">
            <el-alert type="error" :closable="false">
              {{ errMsg }}
            </el-alert>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="border-t my-2 border-[var(--border-color)]"></div>
        </el-descriptions-item>
        <el-descriptions-item label="Inverse逆元: ">
          <div class="inline-block w-[660px]">
            <!-- <radix-input default-radix="0d" v-model="modulus" ref="modulusInputRef" /> -->
            <radix-box default-radix="0d" :num-data="inverse" />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </content-card>
</template>
