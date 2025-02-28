<script lang="ts" setup>
import genSignature from '@/components/cryptology/secp256k1/genSignature.vue'
import verifySignature from '@/components/cryptology/secp256k1/verifySignature.vue'

interface VerifyInfo {
  signatureR: string
  signatureS: string
  hashMsg: string
  publicKey: string
}
type VerifySignatureType = InstanceType<typeof verifySignature>

const verifySignatureRef = ref<VerifySignatureType>()

function updateVerifyData(verifyData: VerifyInfo) {
  console.log('传递verifyData', verifyData)
  if (verifySignatureRef.value) {
    verifySignatureRef.value.updateVerifyInfo(verifyData)
  }
}
</script>
<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card
      title="ECDSA"
      sub-title="(Elliptic Curve Digital Signature Algorithm, 椭圆曲线数字签名算法)"
    >
      <div>
        <p class="text-sm">
          ECDSA是
          <span class="font-bold">基于椭圆曲线(Weierstrass 曲线)</span>密码学(ECC)的一种
          <span class="font-bold">数字签名算法</span>
        </p>
        <div class="primary-tips my-4 text-sm">
          <p class="font-bold">Tips:</p>
          <p class="mt-1">
            基于椭圆曲线(Weierstrass 曲线)意味着 支持: secp系列(secp256k1...),
            Brainpool系列(brainpoolP256r1...), NIST P 系列(secp256r1...)
          </p>
        </div>

        <p class="text-sm">关键特点: <span class="font-bold">需要随机数Nonce</span></p>
        <!-- <p>比 RSA 轻量，但比 EdDSA 计算效率低</p> -->
        <div class="mt-4 text-sm">
          <p class="font-bold my-2 text-[16px]">签名和验签流程:</p>
          <div class="pl-4 mt-2">
            <p>假设 A和B两个用户, A 签名信息 B验证信息</p>
            <p>通信双方A和B, 已知信息有:</p>
            <div class="pl-4">
              <div>
                - 椭圆曲线
                <katex
                  class="katex-sm"
                  formula="E_{p}(a,b)\text{ 即 } y^2 \equiv x^3+ax+b \bmod p"
                />
              </div>
              <div>- 基点 G</div>
              <div>- G 的阶 n</div>
              <div>- 要签名的消息 m</div>
            </div>
            <div class="font-bold mt-2">A 签名:</div>
            <div class="pl-4 pb-4">
              <p class="mt-2">
                1. A 生成自己的公钥私钥
                <katex class="katex-sm" formula="H_{A}= G * K_{A}" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  (其中H<sub>A</sub>是 A的公钥是一个坐标点有xy, K<sub>A</sub>是A的私钥, G为基点)
                </span>
              </p>
              <p class="mt-2">
                2. 在 <katex class="katex-sm" formula="\{1,...,n-1\}" />中选择另一个随机私钥k(nonce)
                <span class="text-sm pl-4 text-gray-400"> (n为基点G的阶) </span>
              </p>
              <p class="mt-2">
                3. 计算第2步的随机私钥对应的公钥,
                <katex class="katex-sm" formula="R=kG" />, 取公钥坐标点R的x坐标得到
                <span class="text-[var(--color-danger)]">“r”</span>
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  (R为结果的坐标点, k为第2步的随机数, G为基点)
                </span>
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  若 r=0, 则的回到第2步重新选择一个 k, 并
                  <span class="font-bold">重新计算</span>
                </span>
              </p>
              <p class="mt-2">
                4. 计算 <span class="text-[var(--color-danger)]">"s"</span>,
                <katex class="katex-sm" formula="s = k^{-1}(m + r K_A) \bmod n" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  (k<sup>-1</sup> 为第2步的随机数的模逆表示, m需要签名的信息, r第3步得到,
                  K<sub>A</sub>是A的私钥, n为基点G的阶)
                </span>
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  若 s=0, 则的回到第2步重新选择一个 k, 并
                  <span class="font-bold">重新计算</span>
                </span>
              </p>
              <p class="mt-2">
                5. 发送将 A 的公钥 H<sub>A</sub>, 消息 m, 签名数据
                <span class="text-[var(--color-danger)]">r</span> 和
                <span class="text-[var(--color-danger)]">s</span> , 发送给 B
              </p>
              <div class="primary-tips my-4 text-sm">
                <p class="mt-1">
                  k<sup>-1</sup> 表示在模 n 下的乘法逆元。
                  <a
                    href="/math/mod-operation-app"
                    class="hover:text-[var(--color-primary)] underline cursor-pointer px-2"
                  >
                    乘法逆元
                  </a>
                </p>
              </div>
            </div>
            <div class="font-bold">B 验证签名:</div>
            <div class="pl-4 pb-4">
              <p class="mt-2">
                1. 计算v1
                <katex class="katex-sm" formula="v_1 = s^{-1} m \bmod n" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  (s<sup>-1</sup> s在模 n 下的乘法逆元, 消息 m, n为基点G的阶)
                </span>
              </p>
              <p class="mt-2">
                2. 计算v2
                <katex class="katex-sm" formula="v_1 = s^{-1} r \bmod n" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  (s<sup>-1</sup> s在模 n 下的乘法逆元, r 为A发送的签名数据 , n为基点G的阶)
                </span>
              </p>
              <p class="mt-2">
                3. 计算P
                <katex class="katex-sm" formula="P = v_1 G + v_2 H_{A}" />
                得到的P坐标的x 如果等于r 则签名有效
                <katex class="katex-sm" formula="P_{(x,y)} => P_{x} = r" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  (v<sub>1</sub>, v<sub>2</sub> 1,2步得到, H<sub>A</sub>为A的公钥)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </content-card>
    <gen-signature @go-verify="updateVerifyData" />
    <verify-signature ref="verifySignatureRef" />
  </div>
</template>
