<script lang="ts" setup>
import verifySignature from '@/components/cryptology/schnorr/verify.vue'
import type { VerifyInfo } from '@/components/cryptology/schnorr/sign.vue'

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
    <content-card title="Schnorr" sub-title="(EC-Schnorr)">
      <div class="text-sm">
        <p class="text-sm">Schnorr 签名的椭圆曲线实现，比 ECDSA 更简单、更高效。</p>
        <p>
          Schnorr 签名算法本身
          <span class="font-bold">与具体的曲线无关 </span>,
          可以用于不同类型的椭圆曲线,并不限于椭圆曲线
        </p>
        <p>支持 Ed25519, secp256k1, secp256r1...等椭圆曲线</p>
        <p>
          不仅比传统的 ECDSA 更加简洁高效，而且支持 多重签名(例如,多个用户共同签署一份文件)。
          <br />可用于多重签名(MuSig, MuSig2),如 Bitcoin Taproot 采用 Schnorr 签名
        </p>
      </div>
      <div class="mt-4 text-sm">
        <p class="font-bold my-2 text-[16px]">签名和验签流程:</p>
        <div class="pl-4 mt-2">
          <p>假设 A和B两个用户, A 签名信息 B验证信息</p>
          <p>通信双方A和B, 已知信息有:</p>
          <div class="pl-4">
            <div>
              - 椭圆曲线
              <katex class="katex-sm" formula="E_{p}(a,b)\text{ 即 } y^2 \equiv x^3+ax+b \bmod p" />
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
              <br />
              <span class="text-sm pl-4 text-gray-400">随机数可能是多签的hash...</span>
            </p>
            <p class="mt-2">
              3. 计算第2步的随机私钥对应的公钥,
              <katex class="katex-sm" formula="R=kG" />
              <br />
              <span class="text-sm pl-4 text-gray-400">
                (R为结果的坐标点, k为第2步的随机数, G为基点)
              </span>
            </p>
            <p class="mt-2">
              4. 计算哈希得到 e,
              <katex class="katex-sm" formula="e = Hash(R_x || H_A || m) \bmod n" />
              <br />
              <span class="text-sm pl-4 text-gray-400">
                (R<sub>x</sub>第3步的R坐标点的x坐标、公钥 H<sub>A</sub>、签名的消息 m, n为基点G的阶)
              </span>
              <br />
              <span class="text-sm pl-4 text-gray-400">
                计算 e 时, 使用的哈希函数通常是 <span class="font-bold">Sha256</span>
              </span>
            </p>
            <p class="mt-2">
              5. 计算 <span class="text-[#f56c6c]">"s"</span>,
              <katex class="katex-sm" formula="s = k+e * k_A \bmod n" />
              <br />
              <span class="text-sm pl-4 text-gray-400">
                (k为第2步的随机数, e为第4步的哈希值, K<sub>A</sub>是A的私钥, n为基点G的阶)
              </span>
              <br />
              <span class="text-sm pl-4 text-gray-400">
                若 s=0, 则的回到第2步重新选择一个 k, 并
                <span class="font-bold">重新计算</span>
              </span>
            </p>
            <p class="mt-2">
              6. 发送将 A 的公钥 H<sub>A</sub>, 消息 m, 签名数据(R<sub>x</sub>, s)
              <span class="text-[#f56c6c]">R<sub>x</sub></span> 和
              <span class="text-[#f56c6c]">s</span> , 发送给 B
            </p>
          </div>
          <div class="font-bold">B 验证签名:</div>
          <div class="pl-4 pb-4">
            <p class="mt-2">
              1. 计算哈希值 e,
              <katex class="katex-sm" formula="e = Hash(R_x || H_A || m) \bmod n" />
              <br />
              <span class="text-sm pl-4 text-gray-400">
                (R<sub>x</sub>签名数据的R坐标点的x坐标、公钥 H<sub>A</sub>、签名的消息 m,
                n为基点G的阶)
              </span>
            </p>
            <p class="mt-2">
              2. 验证签名

              <katex class="katex-sm" formula="sG = R_x + e H_A" /> 是否成立
              <br />
              <span class="text-sm pl-4 text-gray-400">
                (s签名数据的s, G基点 , R<sub>x</sub>签名数据的R坐标点的x坐标, e为第1步的e, 公钥
                H<sub>A</sub> )
              </span>
            </p>
          </div>
        </div>
      </div>
    </content-card>
    <cryptology-schnorr-sign @go-verify="updateVerifyData" />
    <cryptology-schnorr-verify ref="verifySignatureRef" />
  </div>
</template>
