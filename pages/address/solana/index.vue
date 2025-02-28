<script setup lang="ts">
import { QuestionFilled, CopyDocument } from '@element-plus/icons-vue'
import elliptic from 'elliptic'
import bs58 from 'bs58'
import { Keypair } from '@solana/web3.js'
import BN from 'bn.js'

const EC = elliptic.ec
const ec = new EC('ed25519')
const privateKey = ref('')
const bs58PrivateKey = ref('')

function randomKey() {
  // 私钥是随机数应该无所谓用什么椭圆曲线生成
  // const key = ec.genKeyPair()
  const keypair = Keypair.generate()
  // bs58PrivateKey.value = bs58.encode(hexToFixUint8Array(privateKey.value))
  privateKey.value = Uint8ArrayToHex(keypair.secretKey)
  bs58PrivateKey.value = bs58.encode(keypair.secretKey) // bs58.encode(hexToFixUint8Array(privateKey.value))
}

const publicKeyFromPrivateKey = computed(() => {
  const publicKey = privateKey.value.slice(32 * 2) || ''
  if (publicKey.length !== 32 * 2) {
    return ''
  }
  return publicKey
})

function onBs58PrivateKeyInput() {
  privateKey.value = Uint8ArrayToHex(bs58.decode(bs58PrivateKey.value))
}
function onPrivateKeyInput() {
  bs58PrivateKey.value = bs58.encode(hexToFixUint8Array(privateKey.value))
}

const hashPrivateKeyStep = computed(() => {
  if (!privateKey.value || privateKey.value.slice(0, 32 * 2).length !== 64) {
    return ''
  }
  return sha512Fn(privateKey.value.slice(0, 32 * 2))
})

const clampingStep = computed(() => {
  if (!hashPrivateKeyStep.value) return ''
  const resU8 = hexToFixUint8Array(hashPrivateKeyStep.value).slice(0, 32)
  console.log(adjustScalarBytes(resU8))
  return Uint8ArrayToHex(adjustScalarBytes(resU8))
})

// clamping 固定化 进行“固定化”（clamping），确保它符合 Ed25519 规则
// ，取前 32 字节，并进行“固定化”

function adjustScalarBytes(bytes: Uint8Array) {
  // Section 5: For X25519, in order to decode 32 random bytes as an integer scalar,
  // set the three least significant bits of the first byte
  bytes[0] &= 248 // 0b1111_1000
  // and the most significant bit of the last to zero,
  bytes[31] &= 127 // 0b0111_1111
  // set the second most significant bit of the last byte to 1
  bytes[31] |= 64 // 0b0100_0000
  return bytes
}

const nModeStep = computed(() => {
  if (!clampingStep.value) return ''
  const littleEndian = hexToFixUint8Array(clampingStep.value).reverse()
  if (!ec.n) return ''
  return new BN(Uint8ArrayToHex(littleEndian), 'hex').mod(ec.n).toString('hex')
  // // console.log(ec);
  // const _res = (new BN(BigInt('0x'+Uint8ArraytoHex(hread.reverse())))).mod(ec.n)
})

const gPointMulStep = computed(() => {
  if (!nModeStep.value) {
    return {
      x: '',
      y: '',
    }
  }
  const res = ec.g.mul(new BN(nModeStep.value, 16))
  return {
    x: res.x.toString('hex'),
    y: res.y.toString('hex'),
  }
})

const compressPublicKeyPointStep = computed(() => {
  if (!gPointMulStep.value.x || !gPointMulStep.value.y) return ''
  const yUint8Arr = hexToFixUint8Array(gPointMulStep.value.y)
  const xUint8Arr = hexToFixUint8Array(gPointMulStep.value.x)
  // 1. y坐标翻转
  const reverseY = yUint8Arr.reverse()
  reverseY[reverseY.length - 1] |= xUint8Arr[xUint8Arr.length - 1] & 1 ? 0x80 : 0
  // reverseY[reverseY.length-1] |= BigInt(`0x${gPointMulStep.value.x}`) & BigInt(1) ? 0x80 : 0
  return Uint8ArrayToHex(reverseY)
})

// (new BN(BigInt('0x'+Uint8ArraytoHex(hread.reverse())))).mod(ec.n)

function copy(data: string) {
  navigator.clipboard.writeText(data)
  ElMessage.success('copy success')
}

const address = computed(() => {
  if (!compressPublicKeyPointStep) return ''
  return bs58.encode(hexToUint8Array(compressPublicKeyPointStep.value))
})
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Solana 公钥和地址生成">
      <p class="mt-6">
        <el-button @click="randomKey">随机生成私钥</el-button>
      </p>
      <div class="mt-6">
        <el-descriptions label-width="220" :column="1">
          <el-descriptions-item label="私钥: ">
            <div class="inline-block w-[660px]">
              <radix-input
                v-model:hex="privateKey"
                ref="privateKeyInputRef"
                @input-value="onPrivateKeyInput"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="bases58私钥: ">
            <div class="inline-block w-[660px]">
              <el-input v-model="bs58PrivateKey" @input="onBs58PrivateKeyInput"></el-input>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span>私钥中解析出来公钥</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>从钱包导出的私钥 => 前32字节Ed25519的私钥, 后32字节为Ed25519的公钥</p>
                  <p>最终计算出来的公钥应该和 私钥中的公钥一致，也起一定校验和的作用</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer ml-1"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px]">
              <radix-box default-radix="0x" :num-data="publicKeyFromPrivateKey" />
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <div class="border-t my-2 border-[var(--border-color)]"></div>
          </el-descriptions-item>

          <el-descriptions-item label-class-name="align-middle">
            <template #label>
              <span class="align-middle pr-1">Step1: 哈希Ed25519的私钥 </span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>使用sha512算法, 其中Ed25519的私钥为 私钥前32字节</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <radix-box default-radix="0x" :num-data="hashPrivateKeyStep" />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label-class-name="align-middle">
            <template #label>
              <span class="align-middle pr-1">Step2: 取前32字节“固定化(clamping)” </span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>取前哈希结果前32字节, 并进行"固定化"操作:</p>
                  <p class="indent-4">1. 清除最低3位(保证私钥是8的倍数) -> hash[0] &= 0b11111000</p>
                  <p class="indent-4">2. 清除最高位(防止溢出) -> hash[31] &= 0b01111111</p>
                  <p class="indent-4">
                    3. 设置第二高位(确保密钥有足够大的数值) -> hash[31] |= 0b01000000
                  </p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <radix-box default-radix="0x" :num-data="clampingStep" />
            </div>
          </el-descriptions-item>

          <el-descriptions-item label-class-name="align-middle">
            <template #label>
              <span class="align-middle pr-1">Step3: 转小端字节序并与曲线的阶做取模</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>转小端字节序, 即uint8Array.reverse</p>
                  <p>转小端字节序后 与 曲线Edwards25519的阶 取模运算</p>
                  <p>Edwards25519的阶为 2^252 + 27742317777372353535851937790883648493</p>
                  <p>
                    即"7237005577332262213973186563042994240857116359379907606001950938285454250989""
                  </p>
                  <!-- 2**252 + 27742317777372353535851937790883648493; -->
                  <!-- n: BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989'), -->
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <radix-box default-radix="0x" :num-data="nModeStep" />
            </div>
          </el-descriptions-item>

          <el-descriptions-item label-class-name="align-middle">
            <template #label>
              <span class="align-middle pr-1">Step4: 与基点G相乘得公钥点</span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>公钥P = a * G</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <!-- <radix-box default-radix="0x" :num-data="nModeStep" /> -->
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span class="align-middle inline-block h-[40px]">
                <div
                  class="border-l-[2px] border-b-[2px] border-[var(--color-primary)] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
                ></div>
                <span class="align-middle pr-1 pl-2 text-[12px]">公钥x坐标</span>
              </span>
            </template>
            <div class="inline-block w-[660px]">
              <radix-box default-radix="0x" :num-data="gPointMulStep.x" />
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <span class="align-middle inline-block h-[40px]">
                <div
                  class="border-l-[2px] border-b-[2px] border-[var(--color-primary)] w-[28px] h-[26px] ml-4 inline-block relative -top-[2px]"
                ></div>
                <span class="align-middle pr-1 pl-2 text-[12px]">公钥y坐标</span>
              </span>
            </template>
            <div class="inline-block w-[660px]">
              <radix-box default-radix="0x" :num-data="gPointMulStep.y" />
            </div>
          </el-descriptions-item>

          <el-descriptions-item label-class-name="align-middle">
            <template #label>
              <span class="align-middle pr-1">Step5: 压缩公钥点得到公钥 </span>
              <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>Ed25519 采用的 <span class="font-bold">压缩公钥表示法</span></p>
                  <p>
                    公钥时只存储 <span class="font-bold">y</span> 坐标 和
                    <span class="font-bold">x 坐标的符号位</span>，而不是完整的 (x, y) 坐标
                  </p>
                  <p>为什么只存储y坐标？</p>
                  <p class="indent-4">
                    Ed25519 采用的是 Twisted Edwards
                    曲线,给定y就可以算出正负两个x坐标,因此只存储y和x的符号位即可
                  </p>
                  <p>x符号0则正数, 1则表负数</p>

                  <p>1. y坐标(32字节) 先转uint8数组然后翻转数组</p>
                  <p>
                    2. 第32字节, 这个字节的第一个bit位存储x坐标的符号位,
                    其余bit位还是存储y坐标的剩余bit
                  </p>
                  <p>3. 最后得到的值即为公钥</p>

                  <p>例如:</p>
                  <p class="indent-4">
                    y坐标 [0111 1111(第1个字节), .... , 1010 1010(第32个字节)], 翻转数组 --> [1010
                    1010(原第32个字节), ..., 0111 1111(第1个字节)]
                  </p>
                  <p class="indent-4">注意: y坐标第一个字节的第一个bit位固定为0</p>
                  <p class="indent-4">
                    第32个字节 的第一个bit位存储x的符号为 即 [1010 1010, ..., 0(x为正数则0,
                    1负数则)111 1111]
                  </p>
                  <p>按此算法 也可解压还原出来y坐标和x坐标是正还是负,从原先的64字节压缩为32字节</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer"
                />
              </el-tooltip>
            </template>
            <div class="inline-block w-[660px] align-middle">
              <radix-box default-radix="0x" :num-data="compressPublicKeyPointStep" />
            </div>
          </el-descriptions-item>

          <el-descriptions-item>
            <div class="border-t my-2 border-[var(--border-color)]"></div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <span>公钥进行base68得到地址</span>
              <!-- <el-tooltip placement="top" effect="primary">
                <template #content>
                  <p>从钱包导出的私钥 => 前32字节Ed25519的私钥, 后32字节为Ed25519的公钥</p>
                  <p>最终计算出来的公钥应该和 私钥中的公钥一致，也起一定校验和的作用</p>
                </template>
                <question-filled
                  class="text-[var(--color-primary)] w-[16px] h-[16px] inline-block align-middle cursor-pointer ml-1"
                />
              </el-tooltip> -->
            </template>
            <div class="inline-block w-[660px] primary-box min-h-[40px] align-middle">
              {{ address }}
              <span class="copy-btn" @click="copy(address)" v-if="address">
                <copy-document class="inline-block w-[16px] h-[16px]"></copy-document>
              </span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </content-card>
  </div>
</template>
