<template>
  <div class="p-10">
    <!-- <p class="font-bold text-lg mb-[20px]">Secp256k1应用</p>
    <p class="text-sm text-gray-400 mb-[10px]">
      在bitcoin中Secp256k1应用于 <b>生成公钥</b>和 <b>交易时生成签名</b>
    </p> -->
    <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px]">
      <p class="font-bold text-lg centre">Base58</p>
      <p class="text-sm text-gray-400 my-[10px]">
        Base58 用于生成 <b>P2PKH</b> 和 <b>P2SH</b> 地址。
      </p>
      <p>相关提案:</p>
      <ul class="pl-4 my-2">
        <li class="list-disc">
          <a
            class="underline text-[#409eff] hover:text-[#347ecc]"
            href="https://github.com/bitcoin/bips/blob/master/bip-0013.mediawiki"
          >
            BIP0013: Pay-to-Script-Hash(P2SH)
          </a>
        </li>
        <li class="list-disc">
          <a
            class="underline text-[#409eff] hover:text-[#347ecc]"
            href="https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki"
          >
            BIP0032: Hierarchical Deterministic Wallets(HD钱包)
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
