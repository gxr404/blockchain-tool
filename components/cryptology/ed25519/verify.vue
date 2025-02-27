<script setup lang="ts">
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { ed25519 } from '@noble/curves/ed25519'
import type { VerifyInfo } from './sign.vue'

const publicKeyInput = ref('')
const signature = ref('')
const msg = ref('')
const verifySignResult = ref('')
const verifySignatureEl = ref<Element>()

const defaultErrInfo = {
  publicKeyInput: {
    error: false,
    errmsg: '',
  },
  msg: {
    error: false,
    errmsg: '',
  },
  signature: {
    error: false,
    errmsg: '',
  },
}

const hasError = ref(defaultErrInfo)

function randomKey() {
  const priv = ed25519.utils.randomPrivateKey()
  const pub = ed25519.getPublicKey(priv)

  publicKeyInput.value = Uint8ArrayToHex(pub)
}

function resetErrorInfo() {
  hasError.value = defaultErrInfo
  verifySignResult.value = ''
}

function verifySign() {
  verifySignResult.value = ''
  if (!publicKeyInput.value) {
    hasError.value.publicKeyInput.error = true
  }
  if (!msg.value) {
    hasError.value.msg.error = true
  }
  if (!signature.value) {
    hasError.value.signature.error = true
  }
  if (!publicKeyInput.value || !msg.value || !signature.value) {
    return
  }
  try {
    const verify = ed25519.verify(signature.value, msg.value, publicKeyInput.value)
    verifySignResult.value = verify === true ? 'yes' : 'no'
  } catch (e) {
    console.error('error', e)
    verifySignResult.value = 'no'
  }
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

function updateVerifyInfo(verifyInfo: VerifyInfo) {
  nextTick(() => {
    signature.value = verifyInfo.signature
    msg.value = verifyInfo.msg
    publicKeyInput.value = verifyInfo.publicKey
    resetErrorInfo()

    if (verifySignatureEl.value) {
      verifySignatureEl.value.scrollIntoView({ behavior: 'instant' })
    }
  })
}

defineExpose({
  updateVerifyInfo,
})
</script>
<template>
  <div ref="verifySignatureEl">
    <content-card title="Ed25519 — 验证签名" description="使用私钥签名消息，使用公钥进行验证">
      <p class="flex gap-4 items-center">
        <el-button @click="randomKey">随机生成私钥公钥</el-button>
        <el-button type="success" @click="verifySign">验证签名</el-button>
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
          <el-descriptions-item label="公钥: ">
            <div class="inline-block w-[660px]">
              <radix-input
                :class="hasError.publicKeyInput.error ? 'error' : ''"
                v-model:hex="publicKeyInput"
                ref="publicKeyInputRef"
                @input-value="onInputValue"
              />
            </div>
            <div
              v-if="hasError.publicKeyInput.error"
              class="text-[#F56C6C] text-sm pl-[136px] my-2"
            >
              {{ hasError.publicKeyInput.errmsg }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <p class="inline-block align-middle">message:</p>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <radix-input
                :class="hasError.msg.error ? 'error' : ''"
                v-model="msg"
                disable-select
                @input-value="onInputValue"
              >
              </radix-input>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <p class="inline-block align-middle">Signature:</p>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <radix-input
                :class="hasError.signature.error ? 'error' : ''"
                v-model="signature"
                disable-select
                @input-value="onInputValue"
              >
              </radix-input>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </content-card>
  </div>
</template>
