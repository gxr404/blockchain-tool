<script setup lang="ts">
import BigNumber from 'bignumber.js'
import type { RadixInput, RadixBox } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>
type RadixBoxType = InstanceType<typeof RadixBox>

const a = ref()
const b = ref()
const aNegative = ref(false)
const bNegative = ref(false)
const modDecimal = ref('')
const point1X = ref('')
const point1Y = ref('')
const point2X = ref('')
const point2Y = ref('')
const aInputRef = ref<RadixInputType>()
const bInputRef = ref<RadixInputType>()
const point1XInputRef = ref<RadixInputType>()
const point1YInputRef = ref<RadixInputType>()
const point2XInputRef = ref<RadixInputType>()
const point2YInputRef = ref<RadixInputType>()
const modInputRef = ref<RadixInputType>()
const resultPointXRadixBoxRef = ref<RadixBoxType>()
const resultPointYRadixBoxRef = ref<RadixBoxType>()

const point1Err = ref(false)
const point1ErrMsg = ref('')
const point2Err = ref(false)
const point2ErrMsg = ref('')

const resultPoint = computed(() => {
  resetErr()
  const defaultResultPoint = {
    x: '',
    y: '',
  }
  if (
    !point1X.value ||
    !point1Y.value ||
    !point2X.value ||
    !point2Y.value ||
    !modDecimal.value ||
    !a.value
  ) {
    return defaultResultPoint
  }
  const point1 = {
    x: point1X.value,
    y: point1Y.value,
  }
  if (!checkEccPoint(a.value, b.value, modDecimal.value, point1)) {
    point1Err.value = true
    point1ErrMsg.value = 'Point1 该点不在曲线上'
    // 虽然有错 还是继续进行
    // return defaultResultPoint
  }
  const point2 = {
    x: point2X.value,
    y: point2Y.value,
  }
  if (!checkEccPoint(a.value, b.value, modDecimal.value, point2)) {
    point2Err.value = true
    point2ErrMsg.value = 'Point2 该点不在曲线上'
    // 虽然有错 还是继续进行
    // return defaultResultPoint
  }
  // const _resultPoint = eccAdd(point1, point2, modDecimal.value, aSymbolValue.value)
  // console.log(_resultPoint)
  // let _x = _resultPoint.x || ''
  // console.log(resultPointXRadixBoxRef.value?.radixValue)
  // if (resultPointXRadixBoxRef.value?.radixValue !== 10 && _x) {
  //   _x = BigNumber(_x, 10).toString(resultPointXRadixBoxRef.value?.radixValue)
  // }
  // let _y = _resultPoint.y || ''
  // if (resultPointYRadixBoxRef.value?.radixValue !== 10 && _y) {
  //   _y = BigNumber(_y, 10).toString(resultPointYRadixBoxRef.value?.radixValue)
  // }
  return eccAdd(point1, point2, modDecimal.value, aSymbolValue.value)
})

const aSymbolValue = computed(() => {
  if (aNegative.value) {
    return '-' + a.value
  }
  return a.value
})

// const bSymbolValue = computed(() => {
//   if (bNegative.value) {
//     return '-' + b.value
//   }
//   return b.value
// })

function fillSecp256k1() {
  a.value = '0'
  b.value = '7'
  aNegative.value = false
  bNegative.value = false
  const modValueHex = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'
  modDecimal.value = BigNumber(modValueHex, 16).toString(10)
}

function radixChange(radix: '0x' | '0d') {
  aInputRef.value?.updateRadix(radix)
  bInputRef.value?.updateRadix(radix)
  point1XInputRef.value?.updateRadix(radix)
  point1YInputRef.value?.updateRadix(radix)
  point2XInputRef.value?.updateRadix(radix)
  point2YInputRef.value?.updateRadix(radix)
  modInputRef.value?.updateRadix(radix)
  resultPointXRadixBoxRef.value?.updateRadix(radix)
  resultPointYRadixBoxRef.value?.updateRadix(radix)
}

function resetErr() {
  point1Err.value = false
  point1ErrMsg.value = ''
  point2Err.value = false
  point2ErrMsg.value = ''
}
</script>
<template>
  <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px]">
    <el-collapse class="collapse-border-none">
      <el-collapse-item name="1">
        <template #title>
          <p class="font-bold !text-[15px]">两点相加</p>
        </template>
        <div class="mt-2 text-sm text-gray-400">
          ECC的公式: <katex class="katex-sm" formula="y^2=x^3+ax+b,\space\space 4a^3+27b^2\neq0" />
        </div>
        <p class="mt-2 text-sm text-gray-400">
          例如: Point1 (x1,y2), Point2(x2, y2) , 计算 Point1 + Point2 = R
        </p>

        <div class="mt-4 text-sm text-gray-400">
          <p>计算过程:</p>
          <ul class="pl-6 leading-10">
            <li>
              1. 计算斜率
              <katex
                class="katex-sm ml-2"
                formula="m= \frac{y_{2} - y_{1}}{x_{2} - x_{1}} \bmod p"
              />
            </li>
            <li>
              2. 两点相加后新点R的x坐标
              <katex class="katex-sm ml-2" formula="x_{R} = m^{2} - x_{1} - x_{2} \bmod p" />
            </li>
            <li>
              3. 两点相加后新点R的y坐标
              <katex
                class="katex-sm ml-2"
                formula="y_{R} = m \times (x_{1} - x_{2}) - y_{1}  \bmod p"
              />
            </li>
          </ul>
        </div>
        <p class="text-sm text-gray-400 mt-[10px]">
          在这个计算过程中， a, b 并未直接出现，但它们已经通过曲线方程<b>约束了所有点的坐标</b>。
        </p>
      </el-collapse-item>
    </el-collapse>

    <div class="mt-[20px] flex justify-between">
      <div>
        <el-button @click="fillSecp256k1">填入Secp256k1参数</el-button>
      </div>
      <div class="flex gap-2">
        <el-button @click="radixChange('0x')">改为16进制输入</el-button>
        <el-button @click="radixChange('0d')">改为10进制输入</el-button>
      </div>
    </div>

    <div class="py-8">
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="Curve">
          <div class="h-[22px] inline-block w-[660px]">&nbsp;</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;a
          </template>
          <div class="inline-flex items-center w-[660px]">
            <div><el-checkbox v-model="aNegative">是否负数</el-checkbox></div>
            <div class="ml-6 mr-2 min-w-[20px]">
              <span :class="['text-[26px]', aNegative ? 'text-[#409eff]' : '']">
                {{ aNegative ? '-' : '+' }}
              </span>
            </div>
            <div class="flex-1">
              <radix-input default-radix="0d" v-model:decimal="a" ref="aInputRef" />
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;b
          </template>
          <div class="inline-flex items-center w-[660px]">
            <div><el-checkbox v-model="bNegative">是否负数</el-checkbox></div>
            <div class="ml-6 mr-2 min-w-[20px]">
              <span :class="['text-[26px]', bNegative ? 'text-[#409eff]' : '']">
                {{ bNegative ? '-' : '+' }}
              </span>
            </div>
            <div class="flex-1">
              <radix-input default-radix="0d" v-model:decimal="b" ref="bInputRef" />
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Mod: ">
          <div class="inline-block w-[660px]">
            <radix-input default-radix="0d" v-model:decimal="modDecimal" ref="modInputRef" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Point1">
          <div class="h-[22px] inline-block w-[660px]">
            &nbsp;
            <div v-if="point1Err" class="text-[#F56C6C] text-sm my-2">
              {{ point1ErrMsg }}
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;x
          </template>
          <div class="inline-block w-[660px]">
            <radix-input
              :class="[point1Err ? 'error' : '']"
              default-radix="0d"
              v-model:decimal="point1X"
              ref="point1XInputRef"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;y
          </template>
          <div class="inline-block w-[660px]">
            <radix-input
              :class="[point1Err ? 'error' : '']"
              default-radix="0d"
              v-model:decimal="point1Y"
              ref="point1YInputRef"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Point2">
          <div class="h-[22px] inline-block w-[660px]">
            &nbsp;
            <div v-if="point2Err" class="text-[#F56C6C] text-sm my-2">
              {{ point2ErrMsg }}
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;x
          </template>
          <div class="inline-block w-[660px]">
            <radix-input
              :class="[point2Err ? 'error' : '']"
              default-radix="0d"
              v-model:decimal="point2X"
              ref="point2XInputRef"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;y
          </template>
          <div class="inline-block w-[660px]">
            <radix-input
              :class="[point2Err ? 'error' : '']"
              default-radix="0d"
              v-model:decimal="point2Y"
              ref="point2YInputRef"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="border-t my-2"></div>
        </el-descriptions-item>
        <el-descriptions-item label="Point1 + Point2">
          <div class="h-[22px] inline-block w-[660px]">&nbsp;</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;x
          </template>
          <div class="inline-block w-[660px]">
            <radix-box
              radix-prefix="0d"
              :num-data="resultPoint.x || ''"
              ref="resultPointXRadixBoxRef"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;y
          </template>
          <div class="inline-block w-[660px]">
            <radix-box
              radix-prefix="0d"
              :num-data="resultPoint.y || ''"
              ref="resultPointYRadixBoxRef"
            />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
