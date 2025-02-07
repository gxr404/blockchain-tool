<script lang="ts" setup>
import BigNumber from 'bignumber.js'
import elliptic from 'elliptic'

import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>

const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')
const privateKeyInput = ref('')
const privateKeyInputRef = ref<RadixInputType>()

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

  const radix = privateKeyInputRef.value.radixValue
  let _privateKeyInput = privateKeyInput.value
  if (radix !== 16) {
    _privateKeyInput = BigNumber(_privateKeyInput, radix).toString(16)
  }

  const key = secp256k1Ec.keyFromPrivate(_privateKeyInput)
  const pubPoint = key.getPublic()
  return {
    x: pubPoint.getX().toString('hex'),
    y: pubPoint.getY().toString('hex'),
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

function randomPrivate() {
  const key = secp256k1Ec.genKeyPair()
  if (!privateKeyInputRef.value) return
  privateKeyInputRef.value.updateRadix('0x')
  privateKeyInput.value = key.getPrivate().toString(16)
}
</script>

<template>
  <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px]">
    <p class="font-bold text-md centre">生成公钥</p>
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
            <radix-input v-model="privateKeyInput" ref="privateKeyInputRef"></radix-input>
          </div>
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
            <el-alert :closable="false" class="primary-alert">
              <radix-box radix-prefix="0x" :num-data="publicKeyInfo.x"></radix-box>
            </el-alert>
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
            <el-alert :closable="false" class="primary-alert">
              <radix-box radix-prefix="0x" :num-data="publicKeyInfo.y"></radix-box>
            </el-alert>
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
