<script lang="ts" setup></script>

<template>
  <div class="p-10">
    <p class="font-bold text-lg mb-[20px]">Secp256k1应用</p>
    <p class="text-sm text-gray-400 mb-[10px]">
      在bitcoin中Secp256k1应用于 <b>生成公钥</b>和 <b>交易时生成签名</b>
    </p>
    <cryptology-gen-public-key></cryptology-gen-public-key>
    <cryptology-gen-signature></cryptology-gen-signature>
  </div>
</template>
