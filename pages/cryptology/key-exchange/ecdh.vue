<script setup lang="ts">
import elliptic from 'elliptic'

const { ec: EC } = elliptic
const curve25519 = new EC('curve25519')

const publicKeyA = ref('')
const privateKeyA = ref('')
const publicKeyB = ref('')
const privateKeyB = ref('')

function randomKey() {
  const keyA = curve25519.genKeyPair()
  const keyB = curve25519.genKeyPair()
  privateKeyA.value = keyA.getPrivate().toString('hex', 64)
  publicKeyA.value = keyA.getPublic().encode('hex', false)
  privateKeyB.value = keyB.getPrivate().toString('hex', 64)
  publicKeyB.value = keyB.getPublic().encode('hex', false)
}

const shareKey = computed(() => {
  if (!privateKeyA.value || !privateKeyB.value) {
    return {
      A: '',
      B: '',
    }
  }
  const keyA = curve25519.keyFromPrivate(privateKeyA.value, 'hex')
  const keyB = curve25519.keyFromPrivate(privateKeyB.value, 'hex')
  const sharedA = keyA.derive(keyB.getPublic()).toString('hex')
  const sharedB = keyB.derive(keyA.getPublic()).toString('hex')
  return {
    A: sharedA,
    B: sharedB,
  }
})

function countPublicInput(type: string, value: string) {
  console.log(type, privateKeyA.value, value, value === privateKeyA.value, value)
  if (type === 'A') {
    const keyA = curve25519.keyFromPrivate(privateKeyA.value, 'hex')
    console.log(keyA)
    publicKeyA.value = keyA.getPublic().encode('hex', false)
  } else {
    const keyB = curve25519.keyFromPrivate(privateKeyB.value, 'hex')
    publicKeyB.value = keyB.getPublic().encode('hex', false)
  }
}
</script>

<template>
  <!-- <div>ECDSA</div> -->
  <div class="flex flex-wrap gap-6 p-10">
    <content-card title="ECDH" sub-title="(Elliptic-curve Diffie–Hellman, 迪菲-赫尔曼密钥交换)">
      <div class="text-sm">
        <p>ECDH用于安全密钥交换, 基于 椭圆曲线 Diffie-Hellman(DH)协议</p>
        <p class="mt-2">关键特点：</p>
        <div class="pl-4">
          <p>1. 不用于签名，只用于共享密钥</p>
          <p>2. 双方通过各自的 私钥 和对方的 公钥 计算 <span class="font-bold">共享密钥</span></p>
          <p>3. 主要用于 端到端加密通信</p>
        </div>
        <p class="mt-2">流程:</p>
        <div class="pl-4">
          <p>1. 双方生成密钥对</p>
          <p>2. 交换公钥: 甲方发送给乙方, 乙方发送给甲方</p>
          <p>3. 计算共享密钥:</p>
          <p class="indent-4">
            甲方计算, 拿自己的私钥和 乙方的公钥相乘 得到 新点的X坐标作为 共享密钥
          </p>
          <p class="indent-4">
            乙方计算，拿自己的私钥和 甲方的公钥相乘 得到 新点的X坐标作为 共享密钥
          </p>
          <p>4. 双方得到的共享秘钥应该是一致的</p>
        </div>

        <p class="mt-2">
          应用 TLS(HTTPS 服务器加密) 、端到端加密(WhatsApp、Signal、Telegram) 、VPN 加密通信
        </p>
        <p class="mt-2">
          ECDH密钥交换, <span class="font-bold">可基于多种椭圆曲线</span>实现. 如:
          Curve25519/Curve448/secp256k1...
        </p>
      </div>
    </content-card>
    <content-card title="基于Curve25519的ECDH">
      <div class="mt-6">
        <p><el-button @click="randomKey">随机私钥</el-button></p>
        <el-descriptions label-width="120" :column="1">
          <el-descriptions-item label="A私钥: ">
            <div class="inline-block w-[660px]">
              <radix-input
                v-model:hex="privateKeyA"
                @input-value="(v) => countPublicInput('A', v)"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="A公钥: ">
            <div class="inline-block w-[660px]">
              <!-- <radix-input v-model:hex="publicKeyA" /> -->
              <radix-box default-radix="0x" :num-data="publicKeyA" />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="B私钥: ">
            <div class="inline-block w-[660px]">
              <radix-input
                v-model:hex="privateKeyB"
                @input-value="(v) => countPublicInput('B', v)"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="B公钥: ">
            <div class="inline-block w-[660px]">
              <!-- <radix-input v-model:hex="publicKeyB" /> -->
              <radix-box default-radix="0x" :num-data="publicKeyB" />
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <p class="my-2">A的公钥 * B的私钥获取X坐标作为的共享密钥:</p>

        <div class="block w-[800px]">
          <radix-box default-radix="0x" :num-data="shareKey.A" />
        </div>
        <p class="mt-4 mb-2">B的公钥 * A的私钥获取X坐标作为的共享密钥:</p>
        <div class="block w-[800px]">
          <radix-box default-radix="0x" :num-data="shareKey.B" />
        </div>
      </div>
    </content-card>
  </div>
</template>
