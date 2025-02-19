<script setup lang="ts">
import type { RadixInput } from '#components'
import BigNumber from 'bignumber.js'

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

const result = computed(() => {
  // console.log('x', gcd('319', '377'))
  if (!number1Decimal.value || !number2Decimal.value) {
    return {
      s: '',
      t: '',
      gcd: '',
    }
  }
  return gcd(number1Decimal.value, number2Decimal.value)
})
</script>
<template>
  <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px]">
    <p class="font-bold">
      最大公约数 <span class="text-sm text-gray-400">(Greatest Common Divisor, GCD)</span>
    </p>
    <p class="text-sm text-gray-400 mt-[10px]">
      如果数a能被数b整除，a就叫做b的<b>倍数</b>，b就叫做a的<b>约数</b>。
    </p>
    <p class="text-sm text-gray-400">
      几个整数中公有的约数，叫做这几个数的公约数；其中最大的一个，叫做这几个数的<b>最大公约数</b>。
    </p>
    <p class="text-sm text-gray-400 pl-4">
      例如 12, 16 <br />
      其中 12 的约数(这里只讨论正约数) 1, 2, 3, 4, 6, 12<br />
      16的约数 1, 2, 4, 8, 16 <br />
      可以看出来 12 16的公约数是 1, 2, 4, 其中最大公约数是 4
    </p>
    <p class="text-sm text-gray-400 mt-[10px]">使用扩展的欧几里得算法</p>
    <div class="pt-6">
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="Number1: ">
          <div class="inline-block w-[660px]">
            <radix-input default-radix="0d" v-model="number1" ref="number1InputRef"> </radix-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Number2: ">
          <div class="inline-block w-[660px]">
            <radix-input default-radix="0d" v-model="number2" ref="number2InputRef"> </radix-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="border-t my-2"></div>
        </el-descriptions-item>

        <el-descriptions-item label="最大公约数: ">
          <div class="inline-block w-[660px]">
            <radix-box radix-prefix="0d" :num-data="result.gcd" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="s: ">
          <div class="inline-block w-[660px]">
            <radix-box radix-prefix="0d" :num-data="result.s || ''" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="t: ">
          <div class="inline-block w-[660px]">
            <radix-box radix-prefix="0d" :num-data="result.t || ''" />
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <div class="mt-2 text-sm">
        其中 s 和 t 满足
        <katex
          class="katex-sm"
          formula="\text{gcd(Number1, Number2)} = \text{Number1} \times s + \text{Number2} \times t = \text{最大公约数}"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
