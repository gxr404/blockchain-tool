<script lang="ts" setup>
import elliptic from 'elliptic'
import bs58 from 'bs58'
import BigNumber from 'bignumber.js'
import { QuestionFilled, CopyDocument } from '@element-plus/icons-vue'

import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>
type Network = 'mainnet' | 'testnet'
type TxType = 'P2PKH' | 'P2SH' | 'P2SH-P2WPKH'

const { ec: EC } = elliptic
const secp256k1Ec = new EC('secp256k1')

const publicKeyInput = ref('')
const publicKeyInputRef = ref<RadixInputType>()
const privateKeyInput = ref('')
const privateKeyInputRef = ref<RadixInputType>()
const network = ref<Network>('mainnet')
const txType = ref<TxType>('P2PKH')
const showExampleRedeemScript = ref(false)
const redeemScriptInput = ref('')
const showMultiSignExampleRedeemScript = ref(false)

const versionPrefixMap = new Map([
  [
    'mainnet',
    new Map([
      ['P2PKH', '00'],
      ['P2SH', '05'],
      ['P2SH-P2WPKH', '05'],
    ]),
  ],
  [
    'testnet',
    new Map([
      ['P2PKH', '6f'],
      ['P2SH', 'c4'],
      ['P2SH-P2WPKH', 'c4'],
    ]),
  ],
])

const privatekeyHex = computed(() => {
  if (!privateKeyInputRef.value || !privateKeyInput.value) {
    return ''
  }
  let _privateKey = privateKeyInput.value
  if (privateKeyInputRef.value.radixValue !== 16) {
    _privateKey = BigNumber(_privateKey, privateKeyInputRef.value.radixValue).toString(16)
  }
  return _privateKey
})

const publickeyHex = computed(() => {
  if (!publicKeyInputRef.value || !publicKeyInput.value) {
    return ''
  }
  let _publicKey = publicKeyInput.value
  if (publicKeyInputRef.value.radixValue !== 16) {
    _publicKey = BigNumber(_publicKey, publicKeyInputRef.value.radixValue).toString(16)
  }
  return _publicKey
})

// P2WPKH的赎回脚本
const redeemScriptP2WPKH = computed(() => {
  if (!publickeyHex.value) return ''
  return `0014${hash160(publickeyHex.value).ripemd160}`
})

// Step 1 公钥的哈希或赎回脚本的哈希
const hash160Step = computed(() => {
  // P2SH
  if (txType.value === 'P2SH') {
    return Boolean(redeemScriptInput.value) ? hash160(redeemScriptInput.value).ripemd160 : ''
  }

  if (!publickeyHex.value) return ''
  const _publicKey = publickeyHex.value
  // P2SH-P2WPKH
  if (txType.value === 'P2SH-P2WPKH') {
    return hash160(redeemScriptP2WPKH.value).ripemd160
  }
  // P2PKH
  return hash160(_publicKey).ripemd160
})

// Step 2 添加版本前缀
const versionPrefixStep = computed(() => {
  const prefix = versionPrefixMap.get(network.value)?.get(txType.value) || ''
  if (!hash160Step.value) {
    return {
      versionPrefix: '',
      publickey: '',
      result: '',
    }
  }
  return {
    versionPrefix: prefix,
    publickey: hash160Step.value,
    result: `${prefix}${hash160Step.value}`,
  }
})

// Step 3 计算校验和
const checksumStep = computed(() => {
  if (!versionPrefixStep.value.result) {
    return {
      checksum: '',
      result: '',
    }
  }
  const checksumVal = hash256(versionPrefixStep.value.result).secondSha256.slice(0, 2 * 4)
  return {
    checksum: checksumVal,
    result: `${versionPrefixStep.value.versionPrefix}${versionPrefixStep.value.publickey}${checksumVal}`,
  }
})

// Step 4: Base58 编码

const base58Step = computed(() => {
  if (!checksumStep.value.result) {
    return ''
  }
  return bs58.encode(hexToUint8Array(checksumStep.value.result))
})

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  if (!privateKeyInputRef.value || !publicKeyInputRef.value) return
  resetHexRadix()

  privateKeyInput.value = key.getPrivate().toString('hex', 64)
  publicKeyInput.value = key.getPublic().encode('hex', true)
  // resetData()
}

function resetHexRadix() {
  if (!privateKeyInputRef.value || !publicKeyInputRef.value) return
  privateKeyInputRef.value.updateRadix('0x')
  publicKeyInputRef.value.updateRadix('0x')
}

function copyHexData() {
  navigator.clipboard.writeText(
    '5221026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e012102c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b92103c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e953ae'
  )
  ElMessage.success('copy success')
}

function onPrivateKeyInput() {
  if (!privateKeyInputRef.value || !publicKeyInputRef.value) return
  resetHexRadix()
  nextTick(() => {
    publicKeyInput.value = derivePublicKey(privatekeyHex.value)
  })
}
function onPublicKeyInput() {
  privateKeyInput.value = ''
}
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Base58">
      <template #description>
        <p class="text-sm text-gray-400 mt-[10px]">
          Base58 用于生成 <b>P2PKH</b> 和 <b>P2SH</b> 地址。
        </p>
        <p class="text-sm text-gray-400 mt-[2px]">
          <b>Base58Check</b>: 从 Step 2 到 Step 4 这个过程称作Base58Check编码
        </p>
        <p class="text-sm text-gray-400 mb-[10px]">
          P2WSH 与P2WPKH 流程一致，只是使用的是<b>赎回脚本</b>哈希
        </p>
        <p>相关提案:</p>
        <ul class="pl-4 my-2">
          <li class="list-disc">
            <a
              class="underline text-[var(--color-primary)] hover:text-[var(--color-primary2)]"
              href="https://github.com/bitcoin/bips/blob/master/bip-0013.mediawiki"
            >
              BIP0013: Pay-to-Script-Hash(P2SH)
            </a>
          </li>
          <li class="list-disc">
            <a
              class="underline text-[var(--color-primary)] hover:text-[var(--color-primary2)]"
              href="https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki"
            >
              BIP0032: Hierarchical Deterministic Wallets(HD钱包)
            </a>
          </li>
        </ul>
      </template>
      <p class="mt-6">
        <el-button @click="randomKey">随机生成私钥公钥</el-button>
      </p>
      <div class="mt-6">
        <el-descriptions label-width="180" :column="1">
          <el-descriptions-item label="私钥: ">
            <div class="inline-block w-[700px]">
              <radix-input
                v-model="privateKeyInput"
                ref="privateKeyInputRef"
                @input-value="onPrivateKeyInput"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="公钥: ">
            <div class="inline-block w-[700px]">
              <radix-input
                v-model="publicKeyInput"
                ref="publicKeyInputRef"
                @input-value="onPublicKeyInput"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="网络: ">
            <div class="inline-block w-[700px]">
              <el-radio-group v-model="network">
                <el-radio value="mainnet">主网</el-radio>
                <el-radio value="testnet">测试网</el-radio>
              </el-radio-group>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="交易类型: ">
            <div class="inline-block w-[700px]">
              <el-radio-group v-model="txType">
                <el-radio value="P2PKH">
                  P2PKH <span class="text-[12px] text-gray-400">(Pay-to-PubKey-Hash)</span>
                </el-radio>
                <el-radio value="P2SH-P2WPKH">
                  P2SH-P2WPKH<span class="text-[12px] text-gray-400">(Nested SegWit)</span>
                </el-radio>
                <el-radio value="P2SH">
                  P2SH<span class="text-[12px] text-gray-400">(Pay-to-Script-Hash)</span>
                </el-radio>
              </el-radio-group>
            </div>
          </el-descriptions-item>

          <el-descriptions-item v-show="txType === 'P2SH-P2WPKH'">
            <template #label>
              <span class="align-middle pr-1 text-gray-400">赎回脚本示例</span>
              <span
                class="text-gray-400 hover:text-[var(--color-primary)] underline cursor-pointer px-2"
                @click="() => (showExampleRedeemScript = !showExampleRedeemScript)"
                >[{{ showExampleRedeemScript ? 'hide' : 'show' }}]
              </span>
            </template>
            <div class="inline-block w-[700px]">
              <template v-if="showExampleRedeemScript">
                <div class="rounded border-dashed p-2 border-2">
                  <p class="mb-2 text-gray-400">
                    P2SH-P2WPKH指的是用 P2SH 封装 P2WPKH, 即用P2WPKH的锁定脚本作为P2SH的赎回脚本
                  </p>

                  <div class="flex items-center mb-2">
                    <span class="mr-2">P2WPKH锁定脚本 ASM:</span>
                    <div class="primary-box min-h-[41px] flex-1">OP_0 {{ '<公钥哈希>' }}</div>
                  </div>
                  <div class="flex items-center mb-2">
                    <span class="mr-2">Hex(对应的脚本哈希):</span>
                    <div class="primary-box min-h-[41px] flex-1 flex">
                      <el-tooltip
                        content="对应OP_0的16进制操作码, 对应隔离见证的版本字节"
                        placement="top"
                        effect="primary"
                      >
                        <span
                          class="cursor-pointer hover:bg-[var(--color-primary)] hover:text-white break-all"
                        >
                          00
                        </span>
                      </el-tooltip>
                      <el-tooltip content="表示接下来的数据是 20 字节" placement="top" effect="red">
                        <span
                          class="cursor-pointer hover:bg-[var(--color-danger)] text-[var(--color-danger)] hover:text-white break-all"
                        >
                          14
                        </span>
                      </el-tooltip>
                      <el-tooltip content="公钥哈希Hash160" placement="top" effect="green">
                        <span
                          class="cursor-pointer hover:bg-[var(--color-success)] text-[var(--color-success)] hover:text-white break-all"
                        >
                          {{ hash160Step || 'd2fcf30a3aee6b144715473a40c68e993418593c' }}
                        </span>
                      </el-tooltip>
                    </div>
                  </div>

                  <p class="mb-2 text-gray-400 text-sm">
                    P2WPKH
                    <a
                      class="hover:text-[var(--color-primary)] underline cursor-pointer px-2"
                      href="https://bitcoin.heapup.tech/technical/script/p2wpkh"
                      target="_blank"
                    >
                      详情查看
                    </a>
                  </p>
                </div>
              </template>
            </div>
          </el-descriptions-item>
          <el-descriptions-item v-show="txType === 'P2SH-P2WPKH'">
            <template #label>
              <span class="align-middle pr-1">赎回脚本</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>P2SH-P2WPKH是使用 P2WPKH的锁定脚本 做为作为赎回脚本</p>
                  <p>所以赎回脚本只会随公钥变化而变化，<b>此时与自己的公钥无关</b></p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>

            <div class="inline-block w-[700px]">
              <radix-box default-radix="0x" :num-data="redeemScriptP2WPKH" />
            </div>
          </el-descriptions-item>

          <el-descriptions-item v-show="txType === 'P2SH'">
            <template #label>
              <span class="align-middle pr-1 text-gray-400">多签赎回脚本示例</span>
              <span
                class="text-gray-400 hover:text-[var(--color-primary)] underline cursor-pointer px-2"
                @click="
                  () => {
                    showMultiSignExampleRedeemScript = !showMultiSignExampleRedeemScript
                  }
                "
                >[{{ showMultiSignExampleRedeemScript ? 'hide' : 'show' }}]
              </span>
            </template>
            <div class="inline-block w-[700px]">
              <template v-if="showMultiSignExampleRedeemScript">
                <div class="rounded border-dashed p-2 border-2">
                  <p class="mb-2 text-[var(--color-danger)]">
                    Nested SegWit指的是P2SH-P2WPKH而不是普通P2SH
                  </p>
                  <p class="text-gray-400">先提供3个公钥</p>
                  <ul class="text-gray-400 pl-4">
                    <li class="list-disc">
                      026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01
                    </li>
                    <li class="list-disc">
                      02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9
                    </li>
                    <li class="list-disc">
                      03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9
                    </li>
                  </ul>

                  <div class="flex items-center mb-2 flex-row flex-wrap">
                    <span class="mr-2">ASM:</span>
                    <div class="primary-box min-h-[41px]">
                      <p>OP_2</p>
                      <p>
                        PUSHDATA(33)
                        026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01
                      </p>
                      <p>
                        PUSHDATA(33)
                        02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9
                      </p>
                      <p>
                        PUSHDATA(33)
                        03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9 OP_3
                      </p>
                      <p>OP_CHECKMULTISIG</p>
                    </div>
                  </div>
                  <div class="flex items-center mb-2 flex-wrap flex-row">
                    <span class="mr-2">Hex(对应的脚本哈希):</span>
                    <div class="primary-box min-h-[41px] w-full">
                      <el-tooltip content="对应OP_2的16进制操作码" placement="top" effect="primary">
                        <span class="blue-span">52</span>
                      </el-tooltip>

                      <el-tooltip
                        content="PUSHDATA(33) 非操作码, 表示接下来的数据是 33 字节"
                        placement="top"
                        effect="green"
                      >
                        <span class="red-span">21</span>
                      </el-tooltip>
                      <el-tooltip content="公钥1" placement="top" effect="green">
                        <span class="green-span">
                          026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01
                        </span>
                      </el-tooltip>
                      <el-tooltip
                        content="PUSHDATA(33) 非操作码, 表示接下来的数据是 33 字节"
                        placement="top"
                        effect="green"
                      >
                        <span class="red-span">21</span>
                      </el-tooltip>
                      <el-tooltip content="公钥2" placement="top" effect="green">
                        <span class="green-span">
                          02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9
                        </span>
                      </el-tooltip>
                      <el-tooltip
                        content="PUSHDATA(33) 非操作码, 表示接下来的数据是 33 字节"
                        placement="top"
                        effect="green"
                      >
                        <span class="red-span">21</span>
                      </el-tooltip>
                      <el-tooltip content="公钥3" placement="top" effect="green">
                        <span class="green-span">
                          03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9
                        </span>
                      </el-tooltip>

                      <el-tooltip content="对应OP_3的16进制操作码" placement="top" effect="red">
                        <span class="red-span">53</span>
                      </el-tooltip>
                      <el-tooltip
                        content="对应OP_CHECKMULTISIG的16进制操作码, 多签验证"
                        placement="top"
                        effect="primary"
                      >
                        <span class="blue-span">ae</span>
                      </el-tooltip>

                      <span class="copy-btn" @click="copyHexData">
                        <copy-document class="inline-block w-[16px] h-[16px]"></copy-document>
                      </span>
                    </div>
                  </div>

                  <p class="mb-2 text-gray-400 text-sm">
                    赎回脚本内容动态变化的(写<b>任意</b>有效的比特币脚本).
                    <a
                      class="hover:text-[var(--color-primary)] underline cursor-pointer px-2"
                      href="https://liaoxuefeng.com/books/blockchain/bitcoin/pay/multi-sign/index.html"
                      target="_blank"
                    >
                      详情查看
                    </a>
                  </p>
                  <p class="mb-2 text-gray-400 text-sm">
                    P2SH ——
                    <a
                      class="hover:text-[var(--color-primary)] underline cursor-pointer px-2"
                      href="https://bitcoin.heapup.tech/technical/script/p2sh"
                      target="_blank"
                    >
                      详情查看
                    </a>
                  </p>
                </div>
              </template>
            </div>
          </el-descriptions-item>
          <el-descriptions-item v-show="txType === 'P2SH'">
            <template #label>
              <span class="align-middle pr-1">赎回脚本</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>赎回脚本发生变化, 生成的对应的P2SH地址也会变化</p>
                  <p>脚本内容是动态变化的(可以写<b>任意</b>有效的比特币脚本)</p>
                  <p>如多签，条件支付，时间锁...</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[700px]">
              <radix-input disable-select v-model="redeemScriptInput"></radix-input>
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <template v-if="txType === 'P2PKH'">
                  <span class="align-middle pr-1">Step 1: 公钥哈希</span>
                  <el-tooltip
                    content="公钥哈希(Hash160) = Ripemd160(Sha256(CompressedPublicKey))"
                    placement="top"
                    effect="primary"
                  >
                    <question-filled
                      class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                    />
                  </el-tooltip>
                </template>
                <template v-else>
                  <span class="align-middle pr-1">Step 1: 脚本哈希</span>
                </template>
              </span>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">{{ hash160Step }}</div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle pr-1">Step 2: 添加版本前缀</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>版本前缀:</p>
                  <p class="indent-3">主网 P2PKH: <span class="font-bold">0x00</span></p>
                  <p class="indent-3">主网 P2SH: <span class="font-bold">0x05</span></p>
                  <p class="indent-3">测试网 P2PKH: <span class="font-bold">0x6f</span></p>
                  <p class="indent-3">测试网 P2SH: <span class="font-bold">0xc4</span></p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span
                    class="cursor-pointer hover:bg-[var(--color-danger)] hover:text-white text-[var(--color-danger)]"
                  >
                    {{ versionPrefixStep.versionPrefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="公钥哈希" placement="top" effect="primary">
                  <span
                    class="cursor-pointer hover:bg-[var(--color-primary)] hover:text-white break-all"
                  >
                    {{ versionPrefixStep.publickey }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle pr-1">Step 3: 计算校验和</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>
                    对 {{ versionPrefixStep.result }} 双重 Sha256 后取前 4 个字节作为校验和,
                    并添加到字符串
                  </p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <div class="primary-box min-h-[41px]">
                <el-tooltip content="版本前缀" placement="top" effect="red">
                  <span
                    class="cursor-pointer hover:bg-[var(--color-danger)] hover:text-white text-[var(--color-danger)]"
                  >
                    {{ versionPrefixStep.versionPrefix }}
                  </span>
                </el-tooltip>
                <el-tooltip content="公钥哈希" placement="top" effect="primary">
                  <span
                    class="cursor-pointer hover:bg-[var(--color-primary)] hover:text-white break-all"
                  >
                    {{ versionPrefixStep.publickey }}
                  </span>
                </el-tooltip>
                <el-tooltip content="校验和" placement="top" effect="green">
                  <span
                    class="cursor-pointer hover:bg-[var(--color-success)] hover:text-white break-all text-[var(--color-success)]"
                  >
                    {{ checksumStep.checksum }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle">
                <span class="align-middle pr-1">Step 4: Base58 编码</span>
                <el-tooltip
                  :content="`Base58编码后的结果即为最终的地址`"
                  placement="top"
                  effect="primary"
                >
                  <question-filled
                    class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                  />
                </el-tooltip>
              </span>
            </template>
            <div class="inline-block w-[700px] align-middle">
              <p class="text-sm text-gray-400 my-[10px]"></p>
              <div class="primary-box min-h-[41px]">{{ base58Step }}</div>
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
