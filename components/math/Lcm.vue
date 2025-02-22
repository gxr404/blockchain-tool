<script setup lang="ts">
import BigNumber from 'bignumber.js'
import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>

const number1 = ref('')
const number2 = ref('')
const number1InputRef = ref<RadixInputType>()
const number2InputRef = ref<RadixInputType>()

const number1Decimal = computed(() => {
  if (!number1InputRef.value || !number1.value) return ''
  const radix = number1InputRef.value.radixValue
  let _number = number1.value
  if (radix !== 10) {
    _number = BigNumber(_number, radix).toString(10)
  }
  return _number
})

const number2Decimal = computed(() => {
  if (!number2InputRef.value || !number2.value) return ''
  const radix = number2InputRef.value.radixValue
  let _number = number2.value
  if (radix !== 10) {
    _number = BigNumber(_number, radix).toString(10)
  }
  return _number
})

const lcmRes = computed(() => {
  // console.log('x', gcd('319', '377'))
  if (!number1Decimal.value || !number2Decimal.value) {
    return ''
  }
  return lcm(number1Decimal.value, number2Decimal.value)
})
</script>
<template>
  <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px]">
    <p class="font-bold">
      最小公倍数 <span class="text-sm text-gray-400">(Least Common Multiple, LCM)</span>
    </p>
    <p class="text-sm text-gray-400 mt-[10px]">
      如果数a能被数b整除，a就叫做b的<b>倍数</b>，b就叫做a的<b>约数</b>。
    </p>
    <p class="text-sm text-gray-400">
      几个整数中公有的倍数，叫做这几个数的公倍数；其中最小的一个，叫做这几个数的<b>最小公倍数</b>。
    </p>
    <p class="text-sm text-gray-400 pl-4">
      例如 12, 16 <br />
      其中 12 的倍数 12, 24, 36, 48, 60, 72, 84, 96 ...<br />
      16的倍数 16, 32, 48, 64, 80, 96... <br />
      可以看出来 12 16的公倍数是 48, 96... 其中最小倍数是 48
    </p>
    <p class="text-sm text-gray-400 mt-[10px]">最小公倍数可以借助最大公约数的算法得出,公式:</p>
    <div class="my-4">
      <katex
        class="katex-sm"
        formula="\text{lcm(Number1, Number2)} = \frac{ |\text{Number1} \times \text{Number2}| }{\text{gcd(Number1, Number2)}} = \text{最小公倍数}"
      />
    </div>

    <div class="pt-6">
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="Number1: ">
          <div class="inline-block w-[660px]">
            <radix-input default-radix="0d" v-model="number1" ref="number1InputRef"> </radix-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Number2: ">
          <div class="inline-block w-[660px] m-h-[42px]">
            <radix-input default-radix="0d" v-model="number2" ref="number2InputRef"> </radix-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="border-t my-2"></div>
        </el-descriptions-item>

        <el-descriptions-item label="最小公倍数: ">
          <div class="inline-block w-[660px]">
            <radix-box default-radix="0d" :num-data="lcmRes" />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style></style>
