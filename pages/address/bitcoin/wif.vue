<script lang="ts" setup>
import elliptic from 'elliptic'
import bs58 from 'bs58'
import { QuestionFilled } from '@element-plus/icons-vue'

import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>
type Network = 'mainnet' | 'testnet'
type CompressFlag = 'compress' | 'none-compress'

const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')
const privateKeyInput = ref('')
const privateKeyInputRef = ref<RadixInputType>()
const network = ref<Network>('mainnet')
const compressFlag = ref<CompressFlag>('compress')

const versionPrefixMap = new Map([
  ['mainnet', '80'],
  ['testnet', 'ef'],
])

// const privatekeyHex = computed(() => {
//   if (!privateKeyInputRef.value || !privateKeyInput.value) {
//     return ''
//   }
//   let _privateKey = privateKeyInput.value
//   if (privateKeyInputRef.value.radixValue !== 16) {
//     _privateKey = BigNumber(_privateKey, privateKeyInputRef.value.radixValue).toString(16)
//   }
//   return _privateKey
// })

const versionPrefixStep = computed(() => {
  const prefix = versionPrefixMap.get(network.value) || ''
  if (!privateKeyInput.value) {
    return {
      versionPrefix: '',
      result: '',
    }
  }
  return {
    versionPrefix: prefix,
    result: `${prefix}${privateKeyInput.value}`,
  }
})

const compressFlagStep = computed(() => {
  const prefix = versionPrefixMap.get(network.value) || ''
  if (!privateKeyInput.value) {
    return {
      compressFlag: '',
      result: '',
    }
  }
  const _compressFlag = compressFlag.value === 'compress' ? '01' : ''
  return {
    compressFlag: _compressFlag,
    result: `${prefix}${privateKeyInput.value}${_compressFlag}`,
  }
})

const checksumStep = computed(() => {
  if (!compressFlagStep.value.result) {
    return {
      checksum: '',
      result: '',
    }
  }
  const checksumVal = hash256(compressFlagStep.value.result).secondSha256.slice(0, 2 * 4)
  return {
    checksum: checksumVal,
    result: `${compressFlagStep.value.result}${checksumVal}`,
  }
})

const base58Step = computed(() => {
  if (!checksumStep.value.result) {
    return ''
  }
  return bs58.encode(hexToUint8Array(checksumStep.value.result))
})

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  if (!privateKeyInputRef.value) return
  resetHexRadix()

  privateKeyInput.value = key.getPrivate().toString('hex', 64)
  // resetData()
}
function resetHexRadix() {
  if (!privateKeyInputRef.value) return
  privateKeyInputRef.value.updateRadix('0x')
}
function onPrivateKeyInput() {}
</script>

<template>
  <div class="p-10">
    <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[960px]">
      <p class="font-bold text-lg">WIF</p>
      <p class="text-sm text-gray-400 my-[10px]">
        WIF(Wallet Import Format)是一种在钱包之间导入导出时使用的私钥格式。
      </p>
      <p class="text-sm text-gray-400 mt-[4px]">WIF私钥对比hex私钥的好处:</p>
      <ul class="text-gray-400 pl-6 text-sm">
        <li class="list-disc">⭐️有网络标识，可区分是主网还是测试网</li>
        <li class="list-disc">⭐️可添加压缩标志，标识公钥是否压缩格式</li>
        <li class="list-disc">有检验和，能够检查输入错误</li>
        <li class="list-disc">长度更短 hex私钥64个字符 wif私钥 约51字符(带压缩标识则52字符)</li>
      </ul>
      <p class="mt-6">
        <el-button @click="randomKey">随机生成私钥公钥</el-button>
      </p>
      <div class="mt-6">
        <el-descriptions label-width="200" :column="1">
          <el-descriptions-item label="私钥: ">
            <div class="inline-block w-[660px]">
              <radix-input
                v-model="privateKeyInput"
                ref="privateKeyInputRef"
                @input-value="onPrivateKeyInput"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="网络: ">
            <div class="inline-block w-[660px]">
              <el-radio-group v-model="network">
                <el-radio value="mainnet">主网</el-radio>
                <el-radio value="testnet">测试网</el-radio>
              </el-radio-group>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle pr-1">Step 1: 添加版本前缀</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>版本前缀:</p>
                  <p class="indent-3">主网: <span class="font-bold">0x80</span></p>
                  <p class="indent-3">测试网: <span class="font-bold">0xef</span></p>
                </template>
                <question-filled
                  class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span class="cursor-pointer hover:bg-[#F56C6C] hover:text-white text-[#F56C6C]">
                    {{ versionPrefixStep.versionPrefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="私钥" placement="top" effect="primary">
                  <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                    {{ privateKeyInput }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label-class-name="compress-label">
            <template #label>
              <span class="align-middle pr-1">Step 2: 是否添加压缩标志 </span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>该标志是为了"在生成公钥时, 生成的是压缩公钥 还是 不压缩的公钥"</p>
                  <p>所以可以从wif私钥看出 未来要生成的公钥是否是压缩的</p>
                </template>
                <question-filled
                  class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <el-radio-group class="w-[660px]" v-model="compressFlag">
                <el-radio value="compress"> 压缩 </el-radio>
                <el-radio value="none-compress">未压缩 </el-radio>
              </el-radio-group>
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span class="red-span">
                    {{ versionPrefixStep.versionPrefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="私钥" placement="top" effect="primary">
                  <span class="blue-span">
                    {{ privateKeyInput }}
                  </span>
                </el-tooltip>
                <el-tooltip content="压缩标志" placement="top" effect="green">
                  <span class="green-span">
                    {{ compressFlagStep.compressFlag }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle pr-1">Step 3: 计算校验和</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>对上一步结果执行双重 Sha256 后取前 4 个字节作为校验和, 并添加到字符串</p>
                </template>
                <question-filled
                  class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span class="red-span">
                    {{ versionPrefixStep.versionPrefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="私钥" placement="top" effect="primary">
                  <span class="blue-span">
                    {{ privateKeyInput }}
                  </span>
                </el-tooltip>
                <el-tooltip content="压缩标志" placement="top" effect="green">
                  <span class="green-span">
                    {{ compressFlagStep.compressFlag }}
                  </span>
                </el-tooltip>

                <el-tooltip content="检验和" placement="top" effect="origin">
                  <span class="origin-span">
                    {{ checksumStep.checksum }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle pr-1">Step 4: Base58 编码</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>Base58 编码后的结果即为 WIF 私钥</p>
                </template>
                <question-filled
                  class="text-[#409eff] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <div class="primary-box min-h-[41px]">
                {{ base58Step }}
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>
<style>
.compress-label {
  display: inline-block;
  /* vertical-align: top; */
  /* vertical-align: middle; */
  vertical-align: bottom;
  height: 30px;
  line-height: 30px;
  margin-bottom: 8px;
}
</style>
