<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { schnorr } from '@noble/curves/secp256k1'

import type { RadixInput, RadixBox } from '#components'

// hex data
const verifyInfo = {
  signature: '',
  publicKey: '',
  msg: '',
}

export type VerifyInfo = typeof verifyInfo

const emit = defineEmits<{
  goVerify: [verifyInfo: typeof verifyInfo]
}>()

const privateKeyInput = ref('')
const publicKeyInput = ref('')
const signature = ref('')

const auxRand = ref('')
const msg = ref('')

const msgInputOption = ref(0)

const hasError = ref({
  privateKeyInput: {
    error: false,
    errmsg: '',
  },
  msg: {
    error: false,
    errmsg: '',
  },
  auxRand: {
    error: false,
    errmsg: '',
  },
})

function randomKey() {
  const priv = schnorr.utils.randomPrivateKey()
  const pub = schnorr.getPublicKey(priv)

  privateKeyInput.value = Uint8ArrayToHex(priv)
  publicKeyInput.value = Uint8ArrayToHex(pub)

  // const msg = new TextEncoder().encode('hello')
  // const sig = schnorr.sign(msg, priv)
  // const isValid = schnorr.verify(sig, msg, pub)
  resetData()
}

function genSign() {
  resetErrorInfo()

  // schnorrSign(
  //   message: Hex,
  //   privateKey: PrivKey,
  //   auxRand: Hex = randomBytes(32)
  // )

  if (!auxRand.value) {
    hasError.value.auxRand.error = true
  } else if (auxRand.value.length !== 32 * 2) {
    hasError.value.auxRand.error = true
    hasError.value.auxRand.errmsg = 'auxRand长度为32字节'
  }
  if (!privateKeyInput.value) {
    hasError.value.privateKeyInput.error = true
  }
  if (!msg.value) {
    hasError.value.msg.error = true
  }
  if (!msg.value || !privateKeyInput.value || !auxRand.value) {
    return
  }

  const msgU8 =
    msgInputOption.value === 0 ? hexToFixUint8Array(msg.value) : utf8ToUint8Array(msg.value)

  const sign = schnorr.sign(msgU8, privateKeyInput.value, hexToFixUint8Array(auxRand.value))

  signature.value = Uint8ArrayToHex(sign)

  verifyInfo.publicKey = publicKeyInput.value
  verifyInfo.signature = signature.value
  verifyInfo.msg = Uint8ArrayToHex(msgU8) // as Uint8Array<ArrayBuffer>
}

function onGoVerify() {
  emit('goVerify', verifyInfo)
}

function onMsgInput() {
  if (msgInputOption.value === 0) {
    msg.value = msg.value.replace(/[^0-9a-fA-F]/g, '')
  }
  resetData()
}

function onPrivateKeyInput() {
  // publicKeyInput.value = ''
  try {
    publicKeyInput.value = Uint8ArrayToHex(schnorr.getPublicKey(privateKeyInput.value))
  } catch {
    publicKeyInput.value = ''
  }
  resetData()
}
watch(msgInputOption, (value, oldValue) => {
  if (value !== oldValue) {
    msg.value = ''
  }
})

function resetData() {
  resetErrorInfo()
  resetSignature()
}
function resetErrorInfo() {
  hasError.value = {
    privateKeyInput: {
      error: false,
      errmsg: '',
    },
    msg: {
      error: false,
      errmsg: '',
    },
    auxRand: {
      error: false,
      errmsg: '',
    },
  }
}

function resetSignature() {
  // signatureR.value = ''
  // signatureS.value = ''
  // DEREncode.value = ''
  // hashMsg.value = ''
  signature.value = ''
  verifyInfo.publicKey = ''
  verifyInfo.signature = ''
  verifyInfo.msg = ''
  verifyInfo.publicKey = ''
}
</script>
<template>
  <content-card
    title="Schnorr - Secp256k1 — 生成签名"
    description="使用私钥签名消息，使用公钥进行验证"
  >
    <p>
      <el-button @click="randomKey">随机生成私钥公钥</el-button>
      <el-button type="success" @click="genSign">生成签名</el-button>
      <el-button @click="onGoVerify" :disabled="!signature"> —> 去验证签名 </el-button>

      <a
        class="hover:text-[var(--color-primary)] underline cursor-pointer px-2 ml-10"
        target="_blank"
        href="https://learnmeabitcoin.com/tools/"
        >详细查看</a
      >
    </p>
    <div class="py-10">
      <el-descriptions label-width="200" :column="1">
        <el-descriptions-item label="私钥: ">
          <div class="inline-block w-[660px]">
            <radix-input
              :class="hasError.privateKeyInput.error ? 'error' : ''"
              v-model:hex="privateKeyInput"
              @input-value="onPrivateKeyInput"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="align-middle">
              <span>公钥:</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <div>
                    <p>使用仅x坐标的公钥, 不需要带 前缀 02或 03</p>
                  </div>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer ml-1"
                />
              </el-tooltip>
            </span>
          </template>
          <div class="inline-block w-[660px]">
            <radix-box default-radix="0x" :num-data="publicKeyInput" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <p class="inline-block align-middle">message(Hex):</p>
          </template>
          <div class="inline-block w-[660px] align-middle">
            <el-input
              :class="hasError.msg.error ? 'error' : ''"
              type="textarea"
              v-model="msg"
              @input="onMsgInput"
              :rows="5"
            >
            </el-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="message输入类型: ">
          <div class="inline-block w-[660px]">
            <el-radio-group class="w-[660px]" v-model="msgInputOption">
              <el-radio :value="0">数据hex</el-radio>
              <el-radio :value="1">数据utf-8</el-radio>
            </el-radio-group>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="align-middle">
              <span>auxRand(辅助随机数)</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <div>
                    <p>辅助随机数 (类似nonce)</p>
                    <p>ps: 第三方库内部使用 taggedHash('BIP0340/nonce', xxx)</p>
                  </div>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer ml-1"
                />
              </el-tooltip>
            </span>
          </template>

          <div class="inline-block w-[660px] align-middle">
            <radix-input
              :class="hasError.auxRand.error ? 'error' : ''"
              v-model="auxRand"
              disable-select
              @input-value="resetData"
            >
            </radix-input>

            <p v-if="hasError.auxRand.error && hasError.auxRand.errmsg" class="danger-box mt-2">
              {{ hasError.auxRand.errmsg }}
            </p>
          </div>
        </el-descriptions-item>

        <!-- 分割线 -->
        <el-descriptions-item>
          <div class="border-t my-2 border-[var(--border-color)]"></div>
        </el-descriptions-item>

        <el-descriptions-item label="Signature">
          <div class="inline-block w-[660px] align-middle">
            <radix-box default-radix="0x" :num-data="signature" />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </content-card>
</template>
