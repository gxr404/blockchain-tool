<script lang="ts" setup>
import BigNumber from 'bignumber.js'
import elliptic from 'elliptic'

import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>

const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')
const privateKeyInput = ref('')
const privateKeyInputRef = ref<RadixInputType>()
const wifPrivateKeyInput = ref('')
const wifPrivateKeyInputError = ref(false)
const wifPrivateKeyInputErrorMsg = ref('')

const compressPubKey = ref('compress')
const publicKeyInfo = computed(() => {
  if (!privateKeyInput.value || !privateKeyInputRef.value) {
    return {
      x: '',
      y: '',
      pubKey: '',
      compactPubKey: '',
    }
  }

  const key = secp256k1Ec.keyFromPrivate(privateKeyHex.value)
  const pubPoint = key.getPublic()
  return {
    x: pubPoint.getX().toString('hex', 64),
    y: pubPoint.getY().toString('hex', 64),
    pubKey: pubPoint.encode('hex', false),
    compactPubKey: pubPoint.encode('hex', true),
  }
})

const publicKeySegment = computed(() => {
  if (compressPubKey.value === 'compress') {
    return {
      prefix: publicKeyInfo.value.compactPubKey.slice(0, 2),
      x: publicKeyInfo.value.compactPubKey.slice(2),
      y: '',
    }
  } else {
    return {
      prefix: publicKeyInfo.value.pubKey.slice(0, 2),
      x: publicKeyInfo.value.pubKey.slice(2, 66),
      y: publicKeyInfo.value.pubKey.slice(66),
    }
  }
})

const privateKeyHex = computed(() => {
  if (!privateKeyInputRef.value || !privateKeyInput.value) return ''
  const radix = privateKeyInputRef.value.radixValue
  let _privateKeyInput = privateKeyInput.value
  if (radix !== 16) {
    _privateKeyInput = BigNumber(_privateKeyInput, radix).toString(16)
  }
  return _privateKeyInput
})

function randomPrivate() {
  const key = secp256k1Ec.genKeyPair()
  if (!privateKeyInputRef.value) return
  privateKeyInputRef.value.updateRadix('0x')
  privateKeyInput.value = key.getPrivate().toString(16, 64)
  nextTick(onPrivateKeyInput)
}

function onPrivateKeyInput() {
  resetError()
  if (!privateKeyHex.value) {
    wifPrivateKeyInput.value = ''
    return
  }
  try {
    const compressFlag = ['compress', 'only-x'].includes(compressPubKey.value)
    wifPrivateKeyInput.value = hexToWif(privateKeyHex.value, compressFlag)
  } catch (e) {
    wifPrivateKeyInput.value = ''
    wifPrivateKeyInputError.value = true
    wifPrivateKeyInputErrorMsg.value = (e as Error).message
  }
}
function onWifPrivateKeyInput() {
  resetError()
  if (!wifPrivateKeyInput.value) {
    privateKeyInput.value = ''
    return
  }
  try {
    const { privateKey, compress } = parseWif(wifPrivateKeyInput.value)
    privateKeyInput.value = privateKey
    compressPubKey.value = compress
  } catch (e) {
    wifPrivateKeyInputError.value = true
    wifPrivateKeyInputErrorMsg.value = (e as Error).message || 'unknown error'
  }
}
function resetError() {
  wifPrivateKeyInputError.value = false
  wifPrivateKeyInputErrorMsg.value = ''
}

watch(compressPubKey, () => {
  nextTick(onPrivateKeyInput)
})
</script>

<template>
  <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px]">
    <p class="font-bold">生成公钥</p>
    <p class="text-sm text-gray-400 my-[10px]">从私钥计算公钥</p>
    <div>
      <el-button @click="randomPrivate">随机私钥</el-button>
    </div>
    <div class="py-10">
      <el-descriptions label-width="80" :column="1">
        <!-- <template #title>
        <p class="font-bold text-lg mb-[20px]">进制转化</p>
      </template> -->
        <el-descriptions-item label="私钥">
          <div class="inline-block w-[660px]">
            <radix-input
              v-model="privateKeyInput"
              ref="privateKeyInputRef"
              @input-value="onPrivateKeyInput"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="WIF私钥">
          <div class="inline-block w-[660px]">
            <el-input
              :class="['h-[38px]', wifPrivateKeyInputError ? 'error' : '']"
              v-model="wifPrivateKeyInput"
              @input="onWifPrivateKeyInput"
            ></el-input>
          </div>
          <div class="mt-[12px] pr-[12px] w-[770px]" v-if="wifPrivateKeyInputError">
            <el-alert type="error" :closable="false">
              {{ wifPrivateKeyInputErrorMsg }}
            </el-alert>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="border-t my-2"></div>
        </el-descriptions-item>
        <el-descriptions-item label="公钥坐标">
          <div class="h-[22px] inline-block w-[660px]"></div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[20px] h-[26px] ml-6 inline-block relative -top-[2px]"
            ></div>
            X
          </template>
          <div class="inline-block w-[660px]">
            <radix-box radix-prefix="0x" :num-data="publicKeyInfo.x" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[20px] h-[26px] ml-6 inline-block relative -top-[2px]"
            ></div>
            Y
          </template>
          <div class="inline-block w-[660px]">
            <radix-box radix-prefix="0x" :num-data="publicKeyInfo.y" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="&nbsp;">
          <div class="inline-block w-[660px]">
            <el-radio-group class="w-[660px]" v-model="compressPubKey">
              <el-radio value="compress"> 压缩公钥 </el-radio>
              <el-radio value="none-compress">未压缩公钥 </el-radio>
              <el-radio value="only-x">仅x坐标的公钥 </el-radio>
              <!-- Taproot输出中使用仅限x的公钥。假设相应的y坐标是偶数。 -->
            </el-radio-group>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="公钥">
          <div class="inline-block w-[660px] align-middle">
            <div class="primary-box min-h-[40px]">
              <template v-if="compressPubKey !== 'only-x'">
                <el-tooltip
                  :content="
                    compressPubKey === 'compress'
                      ? 'y 坐标的奇偶性: 02表示偶数, 03 表示奇数'
                      : '未压缩公钥04'
                  "
                  placement="top"
                  effect="red"
                >
                  <span class="cursor-pointer hover:bg-[#F56C6C] hover:text-white text-[#F56C6C]">{{
                    publicKeySegment.prefix
                  }}</span>
                </el-tooltip>
                <el-tooltip content="x 坐标" placement="top" effect="primary">
                  <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                    {{ publicKeySegment.x }}
                  </span>
                </el-tooltip>
                <el-tooltip
                  v-if="compressPubKey === 'none-compress'"
                  content="y 坐标"
                  placement="bottom"
                  effect="green"
                >
                  <span
                    class="cursor-pointer hover:bg-[#67C23A] hover:text-white break-all text-[#67C23A]"
                  >
                    {{ publicKeySegment.y }}
                  </span>
                </el-tooltip>
              </template>
              <template v-else>
                <el-tooltip content="Taproot输出 使用仅限x的公钥" placement="top" effect="primary">
                  <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                    {{ publicKeyInfo.x }}
                  </span>
                </el-tooltip>
              </template>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
