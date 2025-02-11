<script lang="ts" setup>
import elliptic from 'elliptic'
import BigNumber from 'bignumber.js'
import { bech32 } from 'bech32'
import { QuestionFilled } from '@element-plus/icons-vue'

import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>
type Network = 'mainnet' | 'testnet' | 'regtest'

const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')

const publicKeyInput = ref('')
const publicKeyInputRef = ref<RadixInputType>()
const privateKeyInput = ref('')
const privateKeyInputRef = ref<RadixInputType>()
const network = ref<Network>('mainnet')

const networkPrefixMap = new Map([
  ['mainnet', 'bc'],
  ['testnet', 'tb'],
  ['regtest', 'bcrt'],
])

const privatekeyHex = computed(() => {
  if (!privateKeyInputRef.value || !privateKeyInput.value) {
    return ''
  }
  let _privateKey = privateKeyInput.value
  if (privateKeyInputRef.value.radixValue !== 16) {
    _privateKey = BigNumber(_privateKey, privateKeyInputRef.value.radixValue).toString(16)
  }
  return _privateKey
})

const publickeyHex = computed(() => {
  if (!publicKeyInputRef.value || !publicKeyInput.value) {
    return ''
  }
  let _publicKey = publicKeyInput.value
  if (publicKeyInputRef.value.radixValue !== 16) {
    _publicKey = BigNumber(_publicKey, publicKeyInputRef.value.radixValue).toString(16)
  }
  return _publicKey
})

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  if (!privateKeyInputRef.value || !publicKeyInputRef.value) return
  resetHexRadix()

  privateKeyInput.value = key.getPrivate().toString('hex')
  publicKeyInput.value = key.getPublic().encode('hex', true)
}

function resetHexRadix() {
  if (!privateKeyInputRef.value || !publicKeyInputRef.value) return
  privateKeyInputRef.value.updateRadix('0x')
  publicKeyInputRef.value.updateRadix('0x')
}

// Step 1 公钥的哈希或赎回脚本的哈希
const hash160Step = computed(() => {
  if (!publickeyHex.value) return ''
  const _publicKey = publickeyHex.value
  return hash160(_publicKey).ripemd160
})

const sliceGroupStep = computed(() => {
  if (!hash160Step.value) return ''
  const binary = BigNumber(hash160Step.value, 16).toString(2)
  // bech32.toWords与sliceGroup类似的效果只是bech32.toWords返回的是10进制
  // bech32.toWords(hexToUint8Array(hash160Step.value))
  const fixBinary = sliceGroup(binary, 5)
  console.log(sliceGroup(binary, 5))
  return fixBinary.map((item) => BigNumber(item, 2).toString(16).padStart(2, '0')).join('')
})

function sliceGroup(binary: string, n: number) {
  if (!binary) return []
  let _binary = binary
  const res = []
  while (_binary) {
    const len = _binary.length
    const start = len - n < 0 ? 0 : len - n
    const segment = _binary.slice(start, len).padStart(n, '0')
    _binary = _binary.slice(0, start)
    res.push(segment)
  }
  return res.reverse()
}

const versionPrefixStep = computed(() => {
  if (!sliceGroupStep.value) {
    return {
      prefix: '',
      result: '',
    }
  }
  return {
    prefix: '00',
    result: `00${sliceGroupStep.value}`,
  }
})

const bech32Step = computed(() => {
  if (!versionPrefixStep.value.result) {
    return {
      prefix: '',
      bech32Value: '',
      result: '',
    }
  }
  const prefix = networkPrefixMap.get(network.value) || ''
  const result = bech32.encode(prefix, hexToUint8Array(versionPrefixStep.value.result))
  const bech32Value = result.replace(new RegExp(prefix), '')
  return {
    prefix,
    bech32Value,
    result,
  }
})

function onPrivateKeyInput() {
  if (!privateKeyInputRef.value || !publicKeyInputRef.value) return
  resetHexRadix()
  nextTick(() => {
    publicKeyInput.value = derivePublicKey(privatekeyHex.value)
  })
}
function onPublicKeyInput() {
  privateKeyInput.value = ''
}
</script>
<template>
  <div class="p-10">
    <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[960px]">
      <p class="font-bold text-lg centre">Bech32</p>
      <p class="text-sm text-gray-400 my-[10px]">Bech32用于从公钥生成 <b>P2WPKH</b> 地址</p>

      <p class="mt-6">
        <el-button @click="randomKey">随机生成私钥公钥</el-button>
      </p>
      <div class="mt-6">
        <el-descriptions label-width="180" :column="1">
          <el-descriptions-item label="私钥: ">
            <div class="inline-block w-[700px]">
              <radix-input
                v-model="privateKeyInput"
                ref="privateKeyInputRef"
                @input-value="onPrivateKeyInput"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="公钥: ">
            <div class="inline-block w-[700px]">
              <radix-input
                v-model="publicKeyInput"
                ref="publicKeyInputRef"
                @input-value="onPublicKeyInput"
              />
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 1: 公钥哈希</span>
                <el-tooltip
                  content="公钥哈希(Hash160) = Ripemd160(Sha256(CompressedPublicKey))"
                  placement="top"
                  effect="primary"
                >
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">{{ hash160Step }}</div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 2: 字节分组</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>1. 转换 Hash160 为二进制</p>
                    <p>2. 每 5 个比特位一组</p>
                    <p>3. 最后一组不足 5 位补零</p>
                    <p class="indent-2">示例:</p>
                    <p class="indent-4">二进制数据: 0111 0101 0001 1110 0111 0110 1110 1000</p>
                    <p class="indent-4">
                      每 5 位一组: 01 11010 10001 11100 11101 10111 01000 (从右往左分割5位)
                    </p>
                    <p class="indent-4">
                      最后一组(从右往左，最后一组即是第一组)不足5位往开头补零: 00001 11010 10001
                      11100 11101 10111 01000
                    </p>
                    <p>4. 按5位一组转16进制, 转成的16机制不满两位补零</p>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">{{ sliceGroupStep }}</div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 3: 添加版本前缀</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>见证版本 0x00</p>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span class="cursor-pointer hover:bg-[#F56C6C] hover:text-white text-[#F56C6C]">
                    {{ versionPrefixStep.prefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="字节分组" placement="top" effect="primary">
                  <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                    {{ sliceGroupStep }}
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

            <div class="inline-block w-[700px]">
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
                <span class="align-middle pr-1">Step 4: Bech32 编码并添加网络前缀</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>Bech32 编码后的结果即为最终的地址</p>
                  </template>
                  <question-filled
                    class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span class="cursor-pointer hover:bg-[#F56C6C] hover:text-white text-[#F56C6C]">
                    {{ bech32Step.prefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="字节分组" placement="top" effect="primary">
                  <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                    {{ bech32Step.bech32Value }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>
