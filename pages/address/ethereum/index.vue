<script lang="ts" setup>
import elliptic from 'elliptic'
import { QuestionFilled, CopyDocument } from '@element-plus/icons-vue'

import type { RadixInput } from '#components'

// viem 使用的'@noble/curves/secp256k1'
const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')

const publicKey = ref('')
const privateKey = ref('')

// Step 1 公钥的哈希或赎回脚本的哈希
const publicKeyHash = computed(() => {
  if (!publicKey.value) {
    return {
      address: '',
      showAddress: '',
    }
  }
  let _publicKey = publicKey.value
  _publicKey = fixHex(_publicKey)
  const res = keccak256(_publicKey.slice(2))
  const address = Array.from(res.slice(-20)) // 取后 20 字节
    .map((i) => i.toString(16).padStart(2, '0')) // 转为 2 位十六进制
    .join('')

  return {
    address,
    showAddress: `0x${address}`,
  }
})

const checksumAddress = computed(() => {
  if (!publicKeyHash.value.address) {
    return {
      address: '',
      showAddress: '',
    }
  }
  const address = toChecksumAddress(publicKeyHash.value.address)
  return {
    address,
    showAddress: `0x${address}`,
  }
})

// test('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
// test('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359')
// test('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB')
// test('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')

// function test(address: string) {
//   console.log(toChecksumAddress(address))
//   console.log(address === `0x${toChecksumAddress(address)}`)
// }
// console.log(toChecksumAddress('0xa8dc2b2'))

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  privateKey.value = key.getPrivate().toString('hex', 64)
  publicKey.value = key.getPublic().encode('hex', false)
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  ElMessage.success('copy success')
}

function toChecksumAddress(address: string) {
  address = address.toLowerCase().replace('0x', '')
  const addressHash = Array.from(keccak256(address, 'utf8')) // 需改用 utf8作为输入
    .map((i) => i.toString(16).padStart(2, '0')) // 转为 2 位十六进制
    .join('')
  console.log(addressHash)
  return address
    .split('')
    .map((char, i) => (parseInt(addressHash[i], 16) >= 8 ? char.toUpperCase() : char))
    .join('')
}

function onPrivateKeyInput() {
  if (!privateKey.value) return
  nextTick(() => {
    publicKey.value = derivePublicKey(privateKey.value, false)
  })
}
function onPublicKeyInput() {
  privateKey.value = ''
}
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Ethereum地址生成">
      <template #description>
        <p class="text-sm text-gray-400 mt-[12px]">
          主网和测试网，以太坊地址的格式是相同的(地址的生成与网络无关)
        </p>
        <p class="text-sm mt-[6px]">相关提案:</p>
        <ul class="text-sm pl-4 my-2">
          <li class="list-disc">
            <a
              class="underline text-[var(--color-primary)] hover:text-[var(--color-primary2)]"
              href="https://eips.ethereum.org/EIPS/eip-55"
            >
              ERC-55: 混合大小写校验和地址编码
            </a>
          </li>
        </ul>
      </template>
      <p class="mt-6">
        <el-button @click="randomKey">随机生成私钥公钥</el-button>
      </p>
      <div class="mt-6">
        <el-descriptions label-width="200" :column="1">
          <el-descriptions-item label="私钥: ">
            <div class="inline-block w-[600px]">
              <radix-input
                v-model:hex="privateKey"
                ref="privateKeyInputRef"
                @input-value="onPrivateKeyInput"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              公钥:
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>以太坊采用secp256k1非压缩公钥</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[600px]">
              <radix-input
                v-model:hex="publicKey"
                ref="publicKeyInputRef"
                @input-value="onPublicKeyInput"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 1: 公钥哈希</span>
                <el-tooltip placement="top" effect="primary">
                  <template #content>
                    <p>1. 移除公钥首字节<b>04</b></p>
                    <p>2. 进行Keccak-256 哈希计算</p>
                    <p>3. 取哈希结果的最后20字节</p>
                  </template>
                  <question-filled
                    class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[600px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">
                {{ publicKeyHash.showAddress }}
                <span
                  class="copy-btn"
                  @click="copy(publicKeyHash.showAddress)"
                  v-if="publicKeyHash.showAddress"
                >
                  <copy-document class="inline-block w-[16px] h-[16px]"></copy-document>
                </span>
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle pr-1">Step2: 计算EIP-55校验地址 </span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>
                    1. 拿step1生成的小写地址 进行Keccak-256 (<b
                      >注意: 地址按字节的utf8转化后传入Keccak-256</b
                    >)
                  </p>
                  <p>2. 哈希后的字符 >= 8 对应原字符的位置 则大写 否则则保持小写,</p>
                  <p>例如:</p>
                  <p class="indent-4">
                    1. 原小写地址: 0xa8dc2b2 --> 转化成 字节数组(Byte Array-Ascii)
                  </p>
                  <p class="indent-6">注意按字节数组和按 hex数组的区别</p>
                  <p class="indent-8">
                    按字节数组 [97, 56, 100, 99, 50, 98, 50] 按每个字符utf8对应编码 (a->97, 8->
                    56....)
                  </p>
                  <p class="indent-8">
                    如果按 hex则是 [10, 141, 194, 178]--> (0a -> 10, 8d -> 141....)
                  </p>
                  <p class="indent-4">2. 对 字节数组 进行Keccak-256编码 得到 "ca49a5c211..."</p>
                  <p class="indent-4">
                    3. 哈希后第1个字符 c 对应10进制12, 12>=8 则大写 原地址第1个字符a则变成A
                  </p>
                  <p class="indent-8">
                    哈希后第3个字符4对应10进制4, {{ '4 < 8' }} 则小写 原地址第3个字符d则小写d
                  </p>
                  <p class="indent-8">
                    哈希后第4个字符 9对应10进制9, {{ '9 >= 8' }} 则大写 则小写
                    原地址第4个字符c则变成C
                  </p>
                  <p class="indent-8">
                    哈希后第6个字符4对应10进制5, {{ '5 < 8' }} 则小写 原地址第6字符b则小写b
                  </p>
                  <p class="indent-4">最终结果 0xA8dC2b2</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[600px] align-middle">
              <div class="primary-box min-h-[41px]">
                {{ checksumAddress.showAddress }}
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </content-card>
  </div>
</template>
<style>
.el-radio.is-checked span {
  color: inherit;
}
</style>
