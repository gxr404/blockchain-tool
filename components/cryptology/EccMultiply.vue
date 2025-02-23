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
const multiplier = ref('')
const point1X = ref('')
const point1Y = ref('')
const aInputRef = ref<RadixInputType>()
const bInputRef = ref<RadixInputType>()
const point1XInputRef = ref<RadixInputType>()
const point1YInputRef = ref<RadixInputType>()
const modInputRef = ref<RadixInputType>()
const multiplierInputRef = ref<RadixInputType>()
const resultPointXRadixBoxRef = ref<RadixBoxType>()
const resultPointYRadixBoxRef = ref<RadixBoxType>()

const point1Err = ref(false)
const point1ErrMsg = ref('')

const resultPoint = computed(() => {
  resetErr()
  const defaultResultPoint = {
    x: '',
    y: '',
  }
  if (!point1X.value || !point1Y.value || !modDecimal.value || !multiplier.value || !a.value) {
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
  try {
    const res = eccMultiply(aSymbolValue.value, b.value, modDecimal.value, point1, multiplier.value)
    // const res = eccMultiplyElliptic(
    //   point1,
    //   multiplier.value,
    //   modDecimal.value,
    //   aSymbolValue.value,
    //   b.value
    // )
    return res
  } catch (e: unknown) {
    point1Err.value = true
    point1ErrMsg.value = (e as Error).message || 'unknown error'
    return defaultResultPoint
  }
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
  modInputRef.value?.updateRadix(radix)
  multiplierInputRef.value?.updateRadix(radix)
  resultPointXRadixBoxRef.value?.updateRadix(radix)
  resultPointYRadixBoxRef.value?.updateRadix(radix)
}

function resetErr() {
  point1Err.value = false
  point1ErrMsg.value = ''
}
</script>
<template>
  <content-card class="py-4">
    <el-collapse class="collapse-top-border-none">
      <el-collapse-item name="1">
        <template #title>
          <p class="font-bold !text-[15px]">点倍乘</p>
        </template>
        <p class="mt-2 text-sm text-gray-400">P (x1,y2) , 计算 P * k = P + P + P ... P(k)</p>
        <p class="mt-2 text-sm text-gray-400">
          点倍乘 不能直接通过常规的数乘计算，而必须通过"两点相加"来完成
        </p>
        <p class="mt-2 text-sm text-gray-400">例如: P * 19</p>
        <div class="mt-2 text-sm text-gray-400">
          <p>计算过程(乘数采用二进制计算可优化计算过程):</p>
          <ul class="pl-6 leading-6">
            <li>1. 乘数转化成二进制 k = 19 = 0b10011</li>
            <li>2. 最高位 1（起始值）→ 设 R = P</li>
            <li>3. 读到 0 → 倍加（ R = 2P ）</li>
            <li>4. 读到 0 → 倍加（ R = 4P ）</li>
            <li>5. 读到 1 → 倍加 + 加（ R = 8P + P = 9P ）</li>
            <li>6. 读到 1 → 倍加 + 加（ R = 18P + P = 19P ）</li>
            <li>
              最终结果:
              <katex
                class="katex-sm ml-2"
                formula="19P = (((P \times 2) \times 2) \times 2 + P) \times 2 + P "
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
        <el-descriptions-item label="Multiplier: ">
          <div class="inline-block w-[660px]">
            <radix-input default-radix="0d" v-model:decimal="multiplier" ref="multiplierInputRef" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="border-t my-2"></div>
        </el-descriptions-item>
        <el-descriptions-item label="Point1 * Multiplier">
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
              default-radix="0d"
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
              default-radix="0d"
              :num-data="resultPoint.y || ''"
              ref="resultPointYRadixBoxRef"
            />
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <div class="py-10">
        <el-collapse>
          <el-collapse-item name="2">
            <template #title>
              <p class="font-bold !text-[15px]">通过阶计算点倍乘</p>
            </template>
            <p class="mt-2 text-sm">有限域中椭圆曲线中的乘法会存在一个<span>循环</span></p>
            <p class="mt-2 text-sm">
              例如: <katex class="katex-sm" formula="E_{97}(2, 3): y^2 = x^3+2x+3 \bmod 7" /> 其中
              点P(3, 6)
            </p>
            <div class="mt-2 text-sm">
              <ul class="pl-6 leading-6">
                <li>1 * P = (3, 6)</li>
                <li>2 * P = P + P = (80, 10)</li>
                <li>3 * P = 2P + P = (80, 87)</li>
                <li>4 * P = 3P + P = (3, 91)</li>
                <li>5 * P = 4P + P = <span class="font-bold text-[#F56C6C]">0</span> (ps: 是零)</li>
                <li>6 * P = 5P + P = (3, 6)</li>
                <li>7 * P = 6P + P = (80, 10)</li>
                <li>...</li>
              </ul>
            </div>
            <p class="text-sm">
              点 P(3,6) 的循环次数为 5, 以及循环计算得到的点集 称 循环子群。
              <span class="font-bold">该点集的数量就叫做阶</span>。 即 点P(3,6)的阶 为 5。
            </p>
            <p class="text-sm">可以看出 如果使用阶的形式 上面的 7 * P = 2P, 这样算点倍乘更优</p>
            <p class="text-sm mt-2">如何计算阶呢?</p>
            <div class="pl-4">
              <p>1. 计算椭圆曲线的阶 N (N 是有限域上椭圆曲线的<b>有效点的数量</b>)</p>
              <p>2. 找出 N 的所有因子</p>
              <p>3. 对每个因子计算 n * P</p>
              <p>4. 找到最小的且满足 n * P=O 的 n, n 就是该点的阶</p>
              <p>例如:</p>
              <div class="pl-4">
                <p>
                  对于椭圆曲线
                  <katex class="katex-sm" formula="E_{37}(-1, 3): y^2 = x^3-x+3 \bmod 37" />
                </p>
                <p>1. 共有 42 个点，因此 N = 42.</p>
                <p>2. 42的因子有 1, 2, 3, 6, 7, 14, 21, 42</p>
                <p>3. 依次与点 P(2, 3)相乘</p>
                <p>4. 1P ≠ 0, 2P≠0, ...7P=0, 因此P的阶是7</p>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </content-card>
</template>
