<script setup lang="ts">
import elliptic from 'elliptic'
import BN from 'bn.js'
import sha256 from 'crypto-js/sha256'
import enc from 'crypto-js/enc-hex'
import BigNumber from 'bignumber.js'
import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>
const { ec: EC } = elliptic

// hex data
const verifyInfo = {
  signatureR: '',
  signatureS: '',
  hashMsg: '',
  publicKey: '',
}

const emit = defineEmits<{
  goVerify: [verifyInfo: typeof verifyInfo]
}>()
const secp256k1Ec = new EC('secp256k1')
const privateKeyInput = ref('')
const publicKeyInput = ref('')
const privateKeyInputRef = ref<RadixInputType>()

const signatureR = ref('')
const signatureS = ref('')
const DEREncode = ref('')
const isCustomNonce = ref(false)
const nonceValue = ref('')
const nonceValueInputRef = ref<RadixInputType>()

const hashMsgOption = ref(0)
const msg = ref()
const hashMsg = ref('')
const hasError = ref({
  privateKeyInput: {
    error: false,
    errmsg: '',
  },
  msg: {
    error: false,
    errmsg: '',
  },
})

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  if (!privateKeyInputRef.value) return
  privateKeyInputRef.value.updateRadix('0x')

  privateKeyInput.value = key.getPrivate().toString('hex', 64)
  publicKeyInput.value = key.getPublic().encode('hex', true)
  resetData()
}

function genSign() {
  resetErrorInfo()

  if (!privateKeyInput.value) {
    hasError.value.privateKeyInput.error = true
  }
  if (!msg.value) {
    hasError.value.msg.error = true
  }
  if (!msg.value || !privateKeyInput.value) {
    return
  }
  if (!privateKeyInputRef.value || !nonceValueInputRef.value) {
    return
  }

  let _hashMsg = msg.value
  if (hashMsgOption.value === 1) {
    _hashMsg = hash256(msg.value).secondSha256
  } else if (hashMsgOption.value === 2) {
    _hashMsg = sha256(msg.value).toString(enc)
    // _msgHash = sha256(enc.parse(msg.value)).toString()
  }

  hashMsg.value = _hashMsg

  const privateKeyRadix = privateKeyInputRef.value.radixValue
  const _privateKey = BigNumber(privateKeyInput.value, privateKeyRadix).toString(16)

  const key = secp256k1Ec.keyFromPrivate(_privateKey, 'hex')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signOptions: any = {}
  if (isCustomNonce.value && nonceValue.value) {
    signOptions.k = () => {
      if (!nonceValueInputRef.value) return
      const nonceValueRadix = nonceValueInputRef.value.radixValue
      return new BN(nonceValue.value, nonceValueRadix)
    }
  }

  const signatureInstance = key.sign(_hashMsg, signOptions)
  signatureR.value = signatureInstance.r.toString('hex', 64)
  signatureS.value = signatureInstance.s.toString('hex', 64)
  DEREncode.value = signatureInstance.toDER('hex')

  verifyInfo.publicKey = publicKeyInput.value
  verifyInfo.signatureR = signatureR.value
  verifyInfo.signatureS = signatureS.value
  verifyInfo.hashMsg = _hashMsg
}

watch(isCustomNonce, () => {
  nonceValue.value = ''
})
watch(hashMsgOption, (value, oldValue) => {
  if (value !== oldValue) {
    msg.value = ''
  }
})

function onGoVerify() {
  emit('goVerify', verifyInfo)
}

function onMsgInput() {
  if (hashMsgOption.value !== 2) {
    msg.value = msg.value.replace(/[^0-9a-fA-F]/g, '')
  }
  resetData()
}

const exampleContent = `
random number   (k): 12345
message:             ECDSA is the most fun I have ever experienced
sha256(message) (z): 103318048148376957923607078689899464500752411597387986125144636642406244063093
private key     (d): 112757557418114203588093402336452206775565751179231977388358956335153294300646

random point (k*G = R): {
  x = 108607064596551879580190606910245687803607295064141551927605737287325610911759,
  y = 6661302038839728943522144359728938428925407345457796456954441906546235843221
}
signature: r = R[x], s = k⁻¹ * (z + r * d): {
  r = 108607064596551879580190606910245687803607295064141551927605737287325610911759,
  s = 73791001770378044883749956175832052998232581925633570497458784569540878807131
}
`

function fillExample() {
  resetData()
  if (privateKeyInputRef.value) {
    privateKeyInputRef.value.updateRadix('0d')
  }
  if (nonceValueInputRef.value) {
    nonceValueInputRef.value.updateRadix('0d')
  }
  isCustomNonce.value = true
  hashMsgOption.value = 2

  nextTick(() => {
    nonceValue.value = '12345'
    msg.value = 'ECDSA is the most fun I have ever experienced'
    privateKeyInput.value =
      '112757557418114203588093402336452206775565751179231977388358956335153294300646'
    publicKeyInput.value = ''
    genSign()
  })
}

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
  }
}

function resetSignature() {
  signatureR.value = ''
  signatureS.value = ''
  DEREncode.value = ''
  hashMsg.value = ''
  verifyInfo.signatureR = ''
  verifyInfo.signatureS = ''
  verifyInfo.hashMsg = ''
  verifyInfo.publicKey = ''
}
</script>
<template>
  <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[860px]">
    <p class="font-bold">生成签名</p>
    <p class="text-sm text-gray-400 my-[10px]">使用私钥签名消息，使用公钥进行验证</p>

    <p>
      <el-button @click="randomKey">随机生成私钥公钥</el-button>
      <el-button type="success" @click="genSign">生成签名</el-button>
      <el-button @click="onGoVerify" :disabled="!signatureR || !signatureS">
        —> 去验证签名
      </el-button>
    </p>
    <div class="py-10">
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="公钥: ">
          <div class="inline-block w-[660px]">
            <radix-box default-radix="0x" :num-data="publicKeyInput" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="私钥: ">
          <div class="inline-block w-[660px]">
            <radix-input
              :class="hasError.privateKeyInput.error ? 'error' : ''"
              v-model="privateKeyInput"
              @input-value="
                () => {
                  publicKeyInput = ''
                  resetData()
                }
              "
              ref="privateKeyInputRef"
            >
            </radix-input>
          </div>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <p class="inline-block align-middle">
              <template v-if="hashMsgOption === 0"> 签名Hash数据: </template>
              <template v-else>
                签名数据: <br />
                <span class="text-sm text-gray-400">(源数据未hash)</span>
              </template>
            </p>
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
        <el-descriptions-item label="签名数据hash: ">
          <div class="inline-block w-[660px]">
            <el-radio-group class="w-[660px]" v-model="hashMsgOption">
              <el-radio :value="0">数据hex, 无需hash</el-radio>
              <el-radio :value="1">数据hex, hash算法hash256</el-radio>
              <el-radio :value="2">数据utf-8, hash算法sha256 </el-radio>
            </el-radio-group>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="自定义Nonce: ">
          <div class="inline-block w-[660px]">
            <el-checkbox v-model="isCustomNonce"></el-checkbox>
          </div>
        </el-descriptions-item>
        <el-descriptions-item v-show="isCustomNonce" label-class-name="align-middle">
          <template #label>
            Nonce: <br />
            <span class="text-[12px] text-gray-400">(ECC中的k)</span>
          </template>
          <div class="inline-block w-[660px] align-middle">
            <radix-input v-model="nonceValue" @input-value="resetData" ref="nonceValueInputRef">
            </radix-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="border-t my-2"></div>
        </el-descriptions-item>
        <el-descriptions-item label="Signature">
          <div class="h-[22px] inline-block w-[660px]">&nbsp;</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[26px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;R
          </template>
          <div class="inline-block w-[660px]">
            <radix-box default-radix="0x" :num-data="signatureR" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[26px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;S
          </template>
          <div class="inline-block w-[660px]">
            <radix-box default-radix="0x" :num-data="signatureS" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[26px] h-[26px] ml-4 inline-block relative -top-[2px]"
            ></div>
            Msg Hash
          </template>
          <div class="inline-block w-[660px]">
            <radix-box default-radix="0x" :num-data="hashMsg" />
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="ECDSA签名">
          <div class="inline-block w-[660px] align-middle">
            <div class="primary-box min-h-[41px]">
              <el-tooltip content="名结果前32字节: R" placement="top" effect="red">
                <span class="cursor-pointer hover:bg-[#F56C6C] hover:text-white text-[#F56C6C]">
                  {{ signatureR }}
                </span>
              </el-tooltip>
              <el-tooltip content="签名结果后32字节: S" placement="top" effect="primary">
                <span class="cursor-pointer hover:bg-[#409eff] hover:text-white break-all">
                  {{ signatureS }}
                </span>
              </el-tooltip>
            </div>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="DER 编码">
          <div class="inline-block w-[660px]">
            <radix-box default-radix="0x" :num-data="DEREncode" />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="my-4">
      <el-collapse>
        <el-collapse-item title="计算例子" name="1">
          <el-button @click="fillExample" class="mb-6">填入例子中数据 + 生成签名</el-button>

          <div class="primary-box w-[800px]">
            <pre class="text-[12px]">
              <code v-html="exampleContent"></code>
            </pre>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
