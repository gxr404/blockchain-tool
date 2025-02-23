<script lang="ts" setup>
import elliptic from 'elliptic'
import BigNumber from 'bignumber.js'
import { bech32m } from 'bech32'
import { QuestionFilled } from '@element-plus/icons-vue'

import type { RadixInput } from '#components'

type Network = 'mainnet' | 'testnet' | 'regtest'

const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')

const publicKeyHex = ref('')
const privateKeyHex = ref('')

const network = ref<Network>('mainnet')

const networkPrefixMap = new Map([
  ['mainnet', 'bc'],
  ['testnet', 'tb'],
  ['regtest', 'bcrt'],
])
const defaultPoint = {
  x: '',
  y: '',
} as const
const internalPublicKey = computed(() => {
  if (!publicKeyHex.value) return defaultPoint
  try {
    const key = secp256k1Ec.keyFromPublic(publicKeyHex.value, 'hex')
    return {
      x: key.getPublic().getX().toString('hex', 64),
      y: key.getPublic().getY().toString('hex', 64),
    }
  } catch {
    return defaultPoint
  }
})

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  privateKeyHex.value = key.getPrivate().toString('hex', 64)
  publicKeyHex.value = key.getPublic().encode('hex', true) //.padStart(66, '0')
}

const tweak = computed(() => {
  if (!internalPublicKey.value.x || !internalPublicKey.value.y) {
    return ''
  }
  return taggedHash('TapTweak', internalPublicKey.value.x)
})

// Q = P + t * G
const taprootPublicKey = computed(() => {
  if (!tweak.value || !internalPublicKey.value.x || !internalPublicKey.value.y) {
    return defaultPoint
  }
  const _tweak = BigNumber(tweak.value, 16).toString(10)

  const taprootPoint = genTaprootPublicKey(
    {
      x: BigNumber(internalPublicKey.value.x, 16).toString(10),
      y: BigNumber(internalPublicKey.value.y, 16).toString(10),
    },
    _tweak
  )
  if (!taprootPoint.x || !taprootPoint.y) return defaultPoint
  return {
    x: BigNumber(taprootPoint.x, 10).toString(16),
    y: BigNumber(taprootPoint.y, 10).toString(16),
  }
})

const regroupBitsStep = computed(() => {
  if (!taprootPublicKey.value || !taprootPublicKey.value.x) return ''
  const binary = BigNumber(taprootPublicKey.value.x, 16).toString(2)
  // bech32.toWords与sliceGroup类似的效果只是bech32.toWords返回的是10进制
  // bech32.toWords(hexToUint8Array(hash160Step.value))
  const fixBinary = regroupBits(binary, 5)
  return fixBinary.map((item) => BigNumber(item, 2).toString(16).padStart(2, '0')).join('')
})

const versionPrefixStep = computed(() => {
  if (!regroupBitsStep.value) {
    return {
      prefix: '',
      result: '',
    }
  }
  const prefix = '01'
  return {
    prefix,
    result: `${prefix}${regroupBitsStep.value}`,
  }
})

const bech32mStep = computed(() => {
  if (!versionPrefixStep.value.result) {
    return {
      prefix: '',
      bech32mValue: '',
      result: '',
    }
  }
  const prefix = networkPrefixMap.get(network.value) || ''
  const result = bech32m.encode(prefix, hexToUint8Array(versionPrefixStep.value.result))
  const bech32mValue = result.replace(new RegExp(prefix), '')
  return {
    prefix,
    bech32mValue,
    result,
  }
})

function onPrivateKeyInput() {
  if (privateKeyHex.value) {
    publicKeyHex.value = derivePublicKey(privateKeyHex.value)
  }
}
function onPublicKeyInput() {
  privateKeyHex.value = ''
}
</script>
<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Bech32m">
      <template #description>
        <p class="text-sm text-gray-400 mt-[10px]">Bech32m用于从公钥生成 <b>P2TR</b> 地址</p>
      </template>
      <p class="mt-6">
        <el-button @click="randomKey">随机生成私钥公钥</el-button>
      </p>
      <div class="mt-6">
        <el-descriptions label-width="220" :column="1">
          <el-descriptions-item label="私钥: ">
            <div class="inline-block w-[660px]">
              <radix-input v-model:hex="privateKeyHex" @input-value="onPrivateKeyInput" />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="压缩公钥: ">
            <div class="inline-block w-[660px]">
              <radix-input
                v-model:hex="publicKeyHex"
                ref="publicKeyInputRef"
                @input-value="onPublicKeyInput"
              />
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 1: 取公钥x坐标(P)</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <div>
                      <p>公钥的 X 坐标作为内部公钥 P</p>
                      <p class="text-[10px] indent-2">
                        使用压缩公钥(只含x坐标)能得到公钥y坐标,是因为代入椭圆曲线方程即可,
                        而私钥无法通过公钥得到
                      </p>
                    </div>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">{{ internalPublicKey.x }}</div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle pr-1">Step 2: 计算 Taproot 公钥</span>
            </template>
            <div class="inline-block w-[660px] align-middle">&nbsp;</div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle inline-block h-[40px]">
                <div
                  class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
                ></div>
                <span class="align-middle pr-1 pl-2 text-[12px]">Step 2.1: 计算 tweak 值 t</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <div>
                      <p class="font-bold">t = taggedHash("TapWeak", P + script_ABC)</p>
                      <p class="indent-4">其中P为step1中的公钥x坐标</p>
                      <p class="indent-4">
                        script_ABC为Taproot锁定脚本(多签，条件支付，时间锁...),
                        <b>普通用户的地址一般是没有的</b>
                      </p>
                      <p>这里忽略script_ABC</p>
                    </div>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[12px] h-[12px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[660px]">
              <radix-box default-radix="0x" :num-data="tweak" />
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle inline-block h-[40px]">
                <div
                  class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
                ></div>
                <span class="pr-1 pl-2 text-[12px]">Step 2.2: 计算新的点</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <div>
                      <p class="font-bold">
                        Q = P + t * G <span class="font-bold">或 (-P) + t * G</span>
                      </p>
                      <p class="indent-2">G点 为Secp256k1算法的常量值</p>
                      <p class="indent-2">t 为step2.1得出</p>
                      <p class="indent-2">
                        P 为 step1 得出公钥x,y 特别需要注意
                        <span class="font-bold">
                          P的y坐标如果为奇数 得使用-P去计算 则变成(-P) + t * G !!!
                        </span>
                      </p>
                      <p class="font-bold indent-4">-P = (x, -y mod p)</p>
                      <!-- <p class="indent-4">采用Secp256k1的加点, 点倍乘即可</p> -->
                    </div>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[12px] h-[12px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <radix-box default-radix="0x" :num-data="taprootPublicKey.x || ''" />
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 3: 字节分组</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>1. 转换 Hash160 为二进制(转化后 不足8bit需补足)</p>
                    <p>2. 每 5 个比特位一组</p>
                    <p>3. 最后一组不足 5 位补零</p>
                    <p class="indent-2">示例:</p>
                    <p class="indent-4">二进制数据: 01110101 00011110 01110110 111010(30bit)</p>
                    <p class="indent-4">
                      原数据按8bit分割头部不足需补零:
                      <span class="font-bold text-[#F56C6C]">00</span>011101 01000111 10011101
                      10111010(30bit)
                    </p>

                    <p class="indent-4">
                      每 5 位一组: 00011 10101 00011 11001 11011 01110 10 (从左往右分割5位)
                    </p>
                    <p class="indent-4">
                      最后一组((从左往右)不足5位结尾补零: 00011 10101 00011 11001 11011 01110
                      10<span class="font-bold text-[#F56C6C]">000</span>
                    </p>
                    <p>4. 按5位一组转16进制, 转成的16机制不满两位补零</p>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">{{ regroupBitsStep }}</div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 4: 添加版本前缀</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>见证版本 0x01</p>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span class="cursor-pointer hover:bg-[#F56C6C] hover:text-white text-[#F56C6C]">
                    {{ versionPrefixStep.prefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="字节分组" placement="top" effect="primary">
                  <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                    {{ regroupBitsStep }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">网络:</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>主网前缀 bc</p>
                    <p>测试网前缀 tb</p>
                    <p>回归测试网前缀 bcrt</p>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>

            <div class="inline-block w-[660px]">
              <el-radio-group v-model="network">
                <el-radio value="mainnet">主网</el-radio>
                <el-radio value="testnet">测试网</el-radio>
                <el-radio value="regtest">回归测试网</el-radio>
              </el-radio-group>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label-class-name="align-middle">
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 5: Bech32m 编码并添加网络前缀</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>Bech32m编码后的结果即为最终的地址</p>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span class="cursor-pointer hover:bg-[#F56C6C] hover:text-white text-[#F56C6C]">
                    {{ bech32mStep.prefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="字节分组" placement="top" effect="primary">
                  <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                    {{ bech32mStep.bech32mValue }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </content-card>
  </div>
</template>
