<script setup lang="ts">
import type { RadixInput } from '#components'
import BigNumber from 'bignumber.js'
import * as elliptic from 'elliptic'
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')

type RadixInputType = InstanceType<typeof RadixInput>

const privateKeyInput = ref('')
const publicKeyInput = ref('')
const signatureR = ref('')
const signatureS = ref('')
const hashMsg = ref('')
const publicKeyInputRef = ref<RadixInputType>()
const hashMsgInputRef = ref<RadixInputType>()
const signatureRInputRef = ref<RadixInputType>()
const signatureSInputRef = ref<RadixInputType>()
const verifySignResult = ref('')
const verifySignatureEl = ref<Element>()

const hasError = ref({
  publicKeyInput: {
    error: false,
    errmsg: '',
  },
  hashMsg: {
    error: false,
    errmsg: '',
  },
  signatureR: {
    error: false,
    errmsg: '',
  },
  signatureS: {
    error: false,
    errmsg: '',
  },
})

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  if (!publicKeyInputRef.value) return
  publicKeyInputRef.value.updateRadix('0x')

  privateKeyInput.value = key.getPrivate().toString('hex')
  publicKeyInput.value = key.getPublic().encode('hex', true)
}

function resetErrorInfo() {
  hasError.value = {
    publicKeyInput: {
      error: false,
      errmsg: '',
    },
    hashMsg: {
      error: false,
      errmsg: '',
    },
    signatureR: {
      error: false,
      errmsg: '',
    },
    signatureS: {
      error: false,
      errmsg: '',
    },
  }
  verifySignResult.value = ''
}

function verifySign() {
  verifySignResult.value = ''
  if (!publicKeyInput.value) {
    hasError.value.publicKeyInput.error = true
  }
  if (!hashMsg.value) {
    hasError.value.hashMsg.error = true
  }
  if (!signatureR.value) {
    hasError.value.signatureR.error = true
  }
  if (!signatureS.value) {
    hasError.value.signatureS.error = true
  }
  if (!publicKeyInput.value || !hashMsg.value || !signatureR.value || !signatureS.value) {
    return
  }
  if (
    !publicKeyInputRef.value ||
    !signatureRInputRef.value ||
    !signatureSInputRef.value ||
    !hashMsgInputRef.value
  ) {
    return
  }

  try {
    const publicKeyInputRadix = publicKeyInputRef.value.radixValue
    let publicKeyHex = publicKeyInput.value
    if (publicKeyInputRadix !== 16) {
      publicKeyHex = BigNumber(publicKeyInput.value, publicKeyInputRadix).toString(16)
    }
    const key = secp256k1Ec.keyFromPublic(publicKeyHex, 'hex')

    const hashMsgInputRadix = hashMsgInputRef.value.radixValue
    let hashMsgHex = hashMsg.value
    if (hashMsgInputRadix !== 16)
      hashMsgHex = BigNumber(hashMsg.value, hashMsgInputRadix).toString(16)

    const signatureRInputRadix = signatureRInputRef.value.radixValue
    let signatureRHex = signatureR.value
    if (signatureRInputRadix !== 16)
      signatureRHex = BigNumber(signatureR.value, signatureRInputRadix).toString(16)

    const signatureSInputRadix = signatureSInputRef.value.radixValue
    let signatureSHex = signatureS.value
    if (signatureSInputRadix !== 16)
      signatureSHex = BigNumber(signatureS.value, signatureSInputRadix).toString(16)

    const signature = {
      r: signatureRHex,
      s: signatureSHex,
    }

    const verify = key.verify(hashMsgHex, signature)
    console.log('verify', hashMsgHex, signature, publicKeyHex)
    verifySignResult.value = verify === true ? 'yes' : 'no'
  } catch (e) {
    console.error('error', e)
    verifySignResult.value = 'no'
  }

  // secp256k1Ec.verify(msgHash.value)
  return
}

watch(verifySignResult, (value) => {
  if (!value) return
  setTimeout(() => {
    verifySignResult.value = ''
  }, 2000)
})

function onInputValue() {
  resetErrorInfo()
  verifySignResult.value = ''
}

interface VerifyInfo {
  signatureR: string
  signatureS: string
  hashMsg: string
  publicKey: string
}

function updateVerifyInfo(verifyInfo: VerifyInfo) {
  if (
    !publicKeyInputRef.value ||
    !signatureRInputRef.value ||
    !signatureSInputRef.value ||
    !hashMsgInputRef.value
  ) {
    return
  }
  signatureSInputRef.value.updateRadix('0x')
  signatureRInputRef.value.updateRadix('0x')
  hashMsgInputRef.value.updateRadix('0x')
  publicKeyInputRef.value.updateRadix('0x')
  nextTick(() => {
    signatureR.value = verifyInfo.signatureR
    signatureS.value = verifyInfo.signatureS
    hashMsg.value = verifyInfo.hashMsg
    publicKeyInput.value = verifyInfo.publicKey
    resetErrorInfo()

    if (verifySignatureEl.value) {
      verifySignatureEl.value.scrollIntoView()
    }
    // verifySignatureEl.value.scrollIntoView({ behavior: 'smooth' })
  })
}

defineExpose({
  updateVerifyInfo,
})
</script>
<template>
  <div
    class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px] mb-[100px]"
    ref="verifySignatureEl"
  >
    <p class="font-bold text-md centre">验证签名</p>
    <p class="text-sm text-gray-400 my-[10px]">使用私钥签名消息，使用公钥进行验证</p>

    <p class="flex gap-4 items-center">
      <el-button @click="randomKey">随机生成私钥公钥</el-button>
      <el-button @click="verifySign">验证签名</el-button>
      <span class="text-sm inline-block align-middle" v-if="verifySignResult">
        <template v-if="verifySignResult === 'yes'">
          <success-filled class="w-[28px] inline-block mr-1 text-[#67C23A]" />
          <span class="text-sm text-gray-400">该公钥成功验证了该签名信息</span>
        </template>
        <template v-else-if="verifySignResult === 'no'">
          <circle-close-filled class="w-[28px] inline-block mr-1 text-[#F56C6C]" />
          <span class="text-sm text-gray-400">该公钥对签名信息验证失败了</span>
        </template>
      </span>
    </p>
    <div class="py-10">
      <el-descriptions label-width="120" :column="1">
        <!-- <template #title>
        <p class="font-bold text-lg mb-[20px]">进制转化</p>
      </template> -->
        <el-descriptions-item label="公钥: ">
          <div class="inline-block w-[660px]">
            <radix-input
              :class="hasError.publicKeyInput.error ? 'error' : ''"
              v-model="publicKeyInput"
              ref="publicKeyInputRef"
              @input-value="onInputValue"
            ></radix-input>
          </div>
          <div v-if="hasError.publicKeyInput.error" class="text-[#F56C6C] text-sm pl-[136px] my-2">
            {{ hasError.publicKeyInput.errmsg }}
          </div>
        </el-descriptions-item>
        <!-- <el-descriptions-item label="私钥: ">
          <div class="inline-block min-w-[660px]">
            <radix-input
              :class="hasError.privateKeyInput.error ? 'error' : ''"
              v-model="privateKeyInput"
              @input-value="onInputValue"
            ></radix-input>
          </div>
        </el-descriptions-item> -->

        <el-descriptions-item>
          <template #label>
            <p class="inline-block align-middle">签名数据Hash:</p>
          </template>
          <div class="inline-block w-[660px] align-middle">
            <radix-input
              :class="hasError.hashMsg.error ? 'error' : ''"
              v-model="hashMsg"
              ref="hashMsgInputRef"
              @input-value="onInputValue"
            >
            </radix-input>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="Signature">
          <div class="h-[22px] inline-block w-[660px]">&nbsp;</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-10 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;R
          </template>
          <div class="inline-block w-[660px]">
            <radix-input
              :class="hasError.signatureR.error ? 'error' : ''"
              v-model="signatureR"
              ref="signatureRInputRef"
              @input-value="onInputValue"
            ></radix-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-10 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;S
          </template>
          <div class="inline-block w-[660px]">
            <radix-input
              :class="hasError.signatureS.error ? 'error' : ''"
              v-model="signatureS"
              ref="signatureSInputRef"
              @input-value="onInputValue"
            ></radix-input>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
