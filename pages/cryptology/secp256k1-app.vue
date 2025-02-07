<script lang="ts" setup>
import type { CryptologyVerifySignature } from '#components'

interface VerifyInfo {
  signatureR: string
  signatureS: string
  hashMsg: string
  publicKey: string
}
type CryptologyVerifySignatureType = InstanceType<typeof CryptologyVerifySignature>

const verifySignatureRef = ref<CryptologyVerifySignatureType>()

function updateVerifyData(verifyData: VerifyInfo) {
  console.log('传递verifyData', verifyData)
  if (verifySignatureRef.value) {
    verifySignatureRef.value.updateVerifyInfo(verifyData)
  }
}
</script>

<template>
  <div class="p-10">
    <p class="font-bold text-lg mb-[20px]">Secp256k1应用</p>
    <p class="text-sm text-gray-400 mb-[10px]">
      在bitcoin中Secp256k1应用于 <b>生成公钥</b>和 <b>交易时生成签名</b>
    </p>
    <cryptology-gen-public-key></cryptology-gen-public-key>
    <cryptology-gen-signature @go-verify="updateVerifyData"></cryptology-gen-signature>
    <cryptology-verify-signature ref="verifySignatureRef"></cryptology-verify-signature>
  </div>
</template>
