<script lang="ts" setup>
import TokenSolana from '~icons/token/solana'
import TokenEthereum from '~icons/token/ethereum'
import TokenBitcoin from '~icons/token/bitcoin'
const route = useRoute()
</script>
<template>
  <div class="min-w-[280px] bg-white h-[100vh]">
    <header id="header" class="h-[160px] relative z-10">
      <!-- -mt-[94px] -->
      <div id="hd-bg" class="absolute w-full"></div>
      <div class="h-[100px] flex items-center justify-center">
        <div class="w-[40px] h-[40px] relative z-10 mr-2">
          <img src="/logo.png" class="inline-block" />
        </div>
        <h1 class="font-bold text-[24px] text-white relative z-10">Blockchain Tool</h1>
      </div>
    </header>
    <div class="h-[100vh] pt-[160px] -mt-[160px]">
      <div
        class="h-full pt-[40px] pl-[10px] -mt-[40px] overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-withe hover:scrollbar-thumb-secondary-foreground"
        style="height: calc(100% + 40px)"
      >
        <el-menu
          router
          class="!mb-10"
          :default-active="route.name === 'index' ? 'hash256' : route.name?.toString()"
        >
          <el-sub-menu index="hash">
            <template #title>
              <span>哈希算法</span>
            </template>
            <el-menu-item index="hash-hash256" :route="{ path: '/hash/hash256' }">
              <span>Hash256</span>
            </el-menu-item>
            <el-menu-item index="hash-hash160" :route="{ path: '/hash/hash160' }">
              <span>Hash160</span>
            </el-menu-item>
            <el-menu-item index="hash-tagged" :route="{ path: '/hash/tagged' }">
              <span>Tagged Hash</span>
            </el-menu-item>
            <el-menu-item index="hash-keccak256" :route="{ path: '/hash/keccak256' }">
              <span>Keccak256</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="cryptology">
            <template #title>
              <span>密码学</span>
            </template>
            <el-sub-menu index="elliptic-curve">
              <template #title>
                <span>椭圆曲线</span>
              </template>
              <el-menu-item index="cryptology-ecc" :route="{ path: '/cryptology/ecc' }">
                <span>ECC基础</span>
              </el-menu-item>
              <el-menu-item index="cryptology-ecc-op" :route="{ path: '/cryptology/ecc-op' }">
                <span>ECC常用操作</span>
              </el-menu-item>
              <el-menu-item index="cryptology-secp256k1" :route="{ path: '/cryptology/secp256k1' }">
                <span>Secp256k1</span>
              </el-menu-item>

              <el-menu-item
                index="cryptology-twisted-edwards"
                :route="{ path: '/cryptology/twisted-edwards' }"
              >
                <span>Twisted Edwards</span>
              </el-menu-item>
              <el-sub-menu index="cryptology-sign">
                <template #title>
                  <span>基于椭圆曲线的签名算法</span>
                </template>

                <el-menu-item
                  index="cryptology-sign-ecdsa"
                  :route="{ path: '/cryptology/sign/ecdsa' }"
                >
                  <span>ECDSA</span>
                </el-menu-item>
                <el-menu-item
                  index="cryptology-sign-eddsa"
                  :route="{ path: '/cryptology/sign/eddsa' }"
                >
                  <span>EdDSA</span>
                </el-menu-item>
                <el-menu-item
                  index="cryptology-sign-schnorr"
                  :route="{ path: '/cryptology/sign/schnorr' }"
                >
                  <span>Schnorr</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="cryptology-key-exchange">
                <template #title>
                  <span>基于椭圆曲线的密钥交换</span>
                </template>

                <el-menu-item
                  index="cryptology-key-exchange-ecdh"
                  :route="{ path: '/cryptology/key-exchange/ecdh' }"
                >
                  <span>ECDH</span>
                </el-menu-item>
              </el-sub-menu>
              <!-- <el-sub-menu index="cryptology-crypto">
                <template #title>
                  <span>基于椭圆曲线的加密算法</span>
                </template>

                <el-menu-item
                  index="cryptology-crypto-ecc"
                  :route="{ path: '/cryptology/crypto/ecies' }"
                >
                  <span>ECIES</span>
                </el-menu-item>
              </el-sub-menu> -->
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="address">
            <template #title>
              <span>地址</span>
            </template>
            <el-sub-menu index="bitcoin">
              <template #title>
                <span class="text-sm mr-1"><token-bitcoin /></span>
                <span>Bitcoin</span>
              </template>
              <el-menu-item
                index="address-bitcoin-gen-public-key"
                :route="{ path: '/address/bitcoin/gen-public-key' }"
              >
                <span>公钥生成</span>
              </el-menu-item>
              <el-menu-item
                index="address-bitcoin-base58"
                :route="{ path: '/address/bitcoin/base58' }"
              >
                <span>Base58</span>
              </el-menu-item>
              <el-menu-item
                index="address-bitcoin-bech32"
                :route="{ path: '/address/bitcoin/bech32' }"
              >
                <span>Bech32</span>
              </el-menu-item>
              <el-menu-item
                index="address-bitcoin-bech32m"
                :route="{ path: '/address/bitcoin/bech32m' }"
              >
                <span>Bech32m</span>
              </el-menu-item>
              <el-menu-item index="address-bitcoin-wif" :route="{ path: '/address/bitcoin/wif' }">
                <span>WIF私钥</span>
              </el-menu-item>
              <el-menu-item>
                <a class="text-gray-400" href="https://bip32jp.github.io/english/"
                  >助记词转化(待定...)</a
                >
                <!-- 源码库: https://github.com/iancoleman/bip39 -->
              </el-menu-item>
              <el-menu-item
                index="address-bitcoin-opcode"
                :route="{ path: '/address/bitcoin/opcode' }"
              >
                <span>Opcode列表</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="address-ethereum" :route="{ path: '/address/ethereum' }">
              <span class="text-sm mr-1"> <token-ethereum /></span>Ethereum
            </el-menu-item>
            <el-menu-item index="address-solana" :route="{ path: '/address/solana' }">
              <span class="text-sm mr-1"><token-solana /></span>Solana
            </el-menu-item>
            <!-- <el-sub-menu index="solana">
              <template #title>
                <span>Solana</span>
              </template>

              <el-menu-item
                index="address-solana-gen-public-key"
                :route="{ path: '/address/solana/gen-public-key' }"
              >
                <span>公钥生成</span>
              </el-menu-item>
            </el-sub-menu> -->
          </el-sub-menu>
          <el-sub-menu index="general">
            <template #title>
              <span>通用</span>
            </template>
            <el-menu-item
              index="general-base-converter"
              :route="{ path: '/general/base-converter' }"
            >
              <span>进制转换</span>
            </el-menu-item>
            <el-menu-item
              index="general-ascii-converter"
              :route="{ path: '/general/ascii-converter' }"
            >
              <span>字节与Ascii转换</span>
            </el-menu-item>
            <el-menu-item index="general-little-endian" :route="{ path: '/general/little-endian' }">
              <span>小端字节序</span>
            </el-menu-item>
            <el-menu-item index="general-compact-size" :route="{ path: '/general/compact-size' }">
              <span>Compact Size</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="math">
            <template #title>
              <span>数学</span>
            </template>
            <el-menu-item index="math-base" :route="{ path: '/math/base' }">
              <span>基础</span>
            </el-menu-item>
            <el-menu-item
              index="math-mod-operation-theory"
              :route="{ path: '/math/mod-operation-theory' }"
            >
              <span>模运算(理论)</span>
            </el-menu-item>
            <el-menu-item
              index="math-mod-operation-app"
              :route="{ path: '/math/mod-operation-app' }"
            >
              <span>模运算</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<style>
#hd-bg {
  background-image: url(/header-bg.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 100%;
  height: 100%;
}
</style>
