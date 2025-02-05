<script setup lang="ts">
import { ec as EC } from 'elliptic'
import BN from 'bn.js'
import sha256 from 'crypto-js/sha256'
import enc from 'crypto-js/enc-hex'
import BigNumber from 'bignumber.js'

const secp256k1Ec = new EC('secp256k1')
const privateKeyInput = ref('')
const privateKeyRadixPrefix = ref<RadixPrefix>('0x')
const publicKeyInput = ref('')
const signatureR = ref('')
const signatureS = ref('')
const DEREncode = ref('')
const isCustomNonce = ref(false)
const nonceValue = ref('')
const nonceValueRadixPrefix = ref<RadixPrefix>('0x')

const hashMsg = ref(0)
const msg = ref()
const hasError = ref({
  privateKeyInput: {
    error: false,
    errmsg: '',
  },
  publicKeyInput: {
    error: false,
    errmsg: '',
  },
  msg: {
    error: false,
    errmsg: '',
  },
})

const radixPrefixMap = {
  '0d': 10,
  '0x': 16,
  '0b': 2,
  '0o': 8,
}

function randomKey() {
  const key = secp256k1Ec.genKeyPair()
  privateKeyInput.value = key.getPrivate().toString('hex')
  publicKeyInput.value = key.getPublic().encode('hex', true)
}
function genSign() {
  resetErrorInfo()

  if (!privateKeyInput.value) {
    hasError.value.privateKeyInput.error = true
    return
  }
  if (!msg.value) {
    hasError.value.msg.error = true
    return
  }
  let _msgHash = msg.value
  if (hashMsg.value === 1) {
    _msgHash = hash256(msg.value).secondSha256
  } else if (hashMsg.value === 2) {
    _msgHash = sha256(msg.value).toString(enc)
    // _msgHash = sha256(enc.parse(msg.value)).toString()
  }
  console.log('msgHash', _msgHash)

  const privateKeyRadix = radixPrefixMap[privateKeyRadixPrefix.value]

  const _privateKey = BigNumber(privateKeyInput.value, privateKeyRadix).toString(16)
  // console.log(msgHash)
  // 02000000030323f0c5cdd3408336cd7e6b6df9cf0ccde996f363b64a066497a5a60c44f7e4000000001976a914c189d7f7ea4333daec66a645cb3388163c22900b88acffffffffcd048bf2054b6885f29246ed1ae55c0e329ed3f0ccaa2d597c6b99b0ed3b97160000000000ffffffff161ec3f56a53829f31665ae94c3d1dee3d4a6b5f1096c0a9f84ce46db70c36770000000000ffffffff026400000000000000225120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954ef40100000000000016001430f7efe4862effb0f6c441347e0653d701321fae0000000001000000
  // msgHash

  const key = secp256k1Ec.keyFromPrivate(_privateKey, 'hex')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signOptions: any = {}
  if (isCustomNonce.value && nonceValue.value) {
    signOptions.k = () => {
      const nonceValueRadix = radixPrefixMap[nonceValueRadixPrefix.value]
      return new BN(nonceValue.value, nonceValueRadix)
    }
  }

  const signatureInstance = key.sign(_msgHash, signOptions)
  signatureR.value = signatureInstance.r.toString('hex')
  signatureS.value = signatureInstance.s.toString('hex')
  DEREncode.value = signatureInstance.toDER('hex')
}

function resetErrorInfo() {
  hasError.value = {
    privateKeyInput: {
      error: false,
      errmsg: '',
    },
    publicKeyInput: {
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
}

watch(privateKeyRadixPrefix, (newRadixPrefix, oldRadixPrefix) => {
  const radix = radixPrefixMap[newRadixPrefix]
  const oldRadix = radixPrefixMap[oldRadixPrefix]
  if (privateKeyInput.value && oldRadixPrefix) {
    privateKeyInput.value = BigNumber(privateKeyInput.value, oldRadix).toString(radix)
  }
})

watch(nonceValueRadixPrefix, (newRadixPrefix, oldRadixPrefix) => {
  const radix = radixPrefixMap[newRadixPrefix]
  const oldRadix = radixPrefixMap[oldRadixPrefix]
  if (nonceValue.value && oldRadixPrefix) {
    nonceValue.value = BigNumber(nonceValue.value, oldRadix).toString(radix)
  }
})

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

function setExample() {
  nonceValueRadixPrefix.value = '0d'
  privateKeyRadixPrefix.value = '0d'
  isCustomNonce.value = true
  hashMsg.value = 2

  nextTick(() => {
    nonceValue.value = '12345'
    msg.value = 'ECDSA is the most fun I have ever experienced'
    privateKeyInput.value =
      '112757557418114203588093402336452206775565751179231977388358956335153294300646'
  })
}

function resetData() {
  resetErrorInfo()
  resetSignature()
}
</script>
<template>
  <div class="flex flex-col p-6 border rounded bg-white mt-10">
    <p class="font-bold text-md centre">生成签名</p>
    <p class="text-sm text-gray-400 my-[10px]">使用私钥签名消息，使用公钥进行验证</p>

    <p>
      <el-button @click="randomKey">随机生成私钥公钥</el-button>
      <el-button @click="genSign">生成签名</el-button>
    </p>
    <div class="py-10">
      <el-descriptions label-width="120" :column="1">
        <!-- <template #title>
        <p class="font-bold text-lg mb-[20px]">进制转化</p>
      </template> -->
        <el-descriptions-item label="公钥: ">
          <div class="inline-block min-w-[660px]">
            <el-input v-model="publicKeyInput" @input="resetData">
              <template #prepend>
                <span>0x</span>
              </template>
            </el-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="私钥: ">
          <div class="inline-block min-w-[660px]">
            <el-input
              :class="hasError.privateKeyInput.error ? 'error' : ''"
              v-model="privateKeyInput"
              clearable
              @input="resetData"
            >
              <template #prepend>
                <el-select v-model="privateKeyRadixPrefix" style="width: 70px">
                  <el-option label="0b" value="0b" />
                  <el-option label="0x" value="0x" />
                  <el-option label="0d" value="0d" />
                </el-select>
              </template>
            </el-input>
          </div>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <p class="inline-block align-middle">
              <template v-if="hashMsg === 0"> 签名Hash数据: </template>
              <template v-else>
                签名数据: <br />
                <span class="text-sm text-gray-400">(源数据未hash)</span></template
              >
            </p>
          </template>
          <div class="inline-block min-w-[660px] align-middle">
            <el-input
              :class="hasError.msg.error ? 'error' : ''"
              type="textarea"
              v-model="msg"
              @input="resetData"
            >
            </el-input>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="签名数据hash: ">
          <div class="inline-block min-w-[660px]">
            <el-radio-group class="w-[660px]" v-model="hashMsg">
              <el-radio :value="0">数据hex, 无需hash</el-radio>
              <el-radio :value="1">数据hex, hash算法hash256</el-radio>
              <el-radio :value="2">数据utf-8, hash算法sha256 </el-radio>
            </el-radio-group>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="自定义Nonce: ">
          <div class="inline-block min-w-[660px]">
            <el-checkbox v-model="isCustomNonce"></el-checkbox>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Nonce(ECC中的k): " v-show="isCustomNonce">
          <div class="inline-block min-w-[660px]">
            <el-input v-model="nonceValue" @input="resetData">
              <template #prepend>
                <el-select v-model="nonceValueRadixPrefix" style="width: 70px">
                  <el-option label="0b" value="0b" />
                  <el-option label="0x" value="0x" />
                  <el-option label="0d" value="0d" />
                </el-select>
              </template>
            </el-input>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="Signature">
          <div class="h-[22px] inline-block min-w-[660px]">&nbsp;</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-10 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;R
          </template>
          <div class="inline-block w-[660px]">
            <el-alert :closable="false" class="primary-alert">
              <radix-box radix-prefix="0x" :num-data="signatureR"></radix-box>
            </el-alert>
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div
              class="border-l-[2px] border-b-[2px] border-[#409eff] w-[28px] h-[26px] ml-10 inline-block relative -top-[2px]"
            ></div>
            &nbsp;&nbsp;&nbsp;S
          </template>
          <div class="inline-block w-[660px]">
            <el-alert :closable="false" class="primary-alert">
              <radix-box radix-prefix="0x" :num-data="signatureS"></radix-box>
            </el-alert>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="DER 编码">
          <div class="inline-block w-[660px]">
            <el-alert :closable="false" class="primary-alert">
              <radix-box radix-prefix="0x" :num-data="DEREncode"></radix-box>
            </el-alert>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="my-4">
      <el-collapse>
        <el-collapse-item title="计算例子" name="1">
          <el-button @click="setExample" class="mb-6">填入例子中数据</el-button>

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
