<template>
  <div class="p-10 pb-0">
    <p class="font-bold text-lg mb-[20px]">ECC常用操作</p>
    <p class="text-sm text-gray-400 mb-[10px]">Secp256k1常见的数学操作包括 加法、倍乘、逆元计算</p>
  </div>
  <div class="flex flex-wrap gap-10 p-10">
    <cryptology-ecc-add></cryptology-ecc-add>
    <cryptology-ecc-multiply></cryptology-ecc-multiply>
  </div>
</template>
