<script lang="ts" setup>
import verifySignature from '@/components/cryptology/ed25519/verify.vue'
import type { VerifyInfo } from '@/components/cryptology/ed25519/sign.vue'

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
  <div class="flex flex-wrap gap-6 p-10">
    <content-card title="EdDSA" sub-title="(Edwards-curve Digital Signature Algorithm)">
      <div class="text-sm leading-6">
        <p>
          EdDSA是一种基于
          <span class="font-bold">Twisted Edwards曲线</span> 的
          <span class="font-bold">数字签名算法</span>。
        </p>
        <p>
          Twisted Edwards曲线是椭圆曲线的一种, 对应公式:
          <katex class="katex-sm" formula="ax^2 + y^2 = 1 + d x^2 y^2" />
        </p>
        <p>
          EdDSA的具体实现有Ed25519 <span class="text-sm">(基于Curve25519的Edwards形式)</span>,
          Ed448...
        </p>
        <p>EdDSA不像ECDSA需要随机数nonce, 签名流程中使用了 sha512</p>
        <hr class="my-6" />
        <p>
          Ed25519签名流程中公钥私钥生成是基于Curve25519 (Ed25519 并不直接使用 Curve25519 的
          Montgomery 形式，而是使用它的 Edwards 变体)
        </p>
        <!-- <p> nobel-curve库中有两个转化秘钥的方法 edwardsToMontgomery edwardsToMontgomeryPub</p> -->
        <div class="mt-4 text-sm">
          <p class="font-bold my-2 text-[16px]">Ed25519签名和验签流程:</p>
          <div class="pl-4 mt-2">
            <p>假设 A和B两个用户, A 签名信息 B验证信息</p>
            <p>通信双方A和B, 已知信息有:</p>
            <div class="pl-4">
              <div>
                - Ed25519椭圆曲线
                <katex
                  class="katex-sm"
                  formula="-x^2 + y^2 \equiv 1 - \frac{121665}{121666} x^2 y^2 \bmod (2^{255}-19)"
                />
              </div>
              <div>- 基点 G</div>
              <div>
                - G 的阶 n
                <katex
                  class="katex-sm"
                  formula="2^{252} + 27742317777372353535851937790883648493"
                />
              </div>
              <div>- 要签名的消息 m</div>
            </div>
            <div class="font-bold mt-2">
              A 签名 (<a
                class="underline text-[#409eff] hover:text-[#347ecc]"
                href="https://github.com/paulmillr/noble-curves/blob/dc3dd98c7aec4024f052eea583ea0fd7872417f8/src/abstract/edwards.ts#L488-L499"
                >详细可看noble-curves代码</a
              >):
            </div>
            <div class="pl-4 pb-4">
              <p class="mt-2">
                1. A 生成自己的公钥私钥, 随机生成 K<sub>A</sub>，然后
                <katex class="katex-sm" formula="h = Hash512(K_A)" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  其中 h 是 64 字节: 前32字节(scalar)用于计算公钥,
                  后32字节(prefix)用于后续生成签名使用
                </span>
                <br />
                <span class="pl-4">... </span>
                <br />
                <span class="pl-4">经过计算得到A的公钥 H<sub>A</sub> </span>
              </p>
              <p class="mt-2">
                2. 计算随机数<span class="text-[#f56c6c]">“r”</span>,
                <katex class="katex-sm" formula="r = littleEndian(Hash512(prefix || m)) \bmod n" />,
                哈希后转小端字节序再模n
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  prefix为私钥hash后32位, m签名的消息, n 为G 的阶
                </span>
              </p>
              <p class="mt-2">
                3. 计算<span class="text-[#f56c6c]">“R”</span>坐标,
                <katex class="katex-sm" formula="R = r * G" />,
                <br />
                <span class="text-sm pl-4 text-gray-400"> G为基点, r为第2步计算的结果 </span>
              </p>

              <p class="mt-2">
                4. 计算<span class="text-[#f56c6c]">“k”</span>
                <katex
                  class="katex-sm"
                  formula="k = littleEndian(Hash512(R|| H_A || m)) \bmod n"
                />, 哈希后转小端字节序再模n
                <br />

                <span class="text-sm pl-4 text-gray-400">
                  R为第3步计算的结果, H<sub>A</sub>为A的公钥, m签名的消息, n 为G 的阶
                </span>
              </p>
              <!-- S = (r + k * s) mod L -->
              <p class="mt-2">
                5. 计算 <span class="text-[#f56c6c]">"S"</span>,
                <katex class="katex-sm" formula="S = (r + k * s) \bmod n" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  r为第2步计算的结果, k为第4步的结果, s为 scalar私钥hash后的前32字节, n 为G 的阶
                </span>
              </p>
              <p class="mt-2">
                6. 生成最后的<span class="text-[#f56c6c]">signature = R + littleEndian(S)</span>
              </p>
            </div>
            <div class="font-bold">
              B 验证签名<a
                class="underline text-[#409eff] hover:text-[#347ecc]"
                href="https://github.com/paulmillr/noble-curves/blob/dc3dd98c7aec4024f052eea583ea0fd7872417f8/src/abstract/edwards.ts#L507-L535"
                >详细可看noble-curves代码</a
              >):
            </div>
            <div class="pl-4 pb-4">
              <div class="mt-2">
                1. 解析签名得到 R和S,
                <p>R = sign的前32个字节</p>
                <p>s = littleEndian(sign的后32个字节), 此时S是小端字节序转回 正常序</p>
              </div>
              <p class="mt-2">
                2. 计算SB
                <katex class="katex-sm" formula="SB = G * s" />
                <br />
                <span class="text-sm pl-4 text-gray-400"> (s第1步得到, G为基点) </span>
              </p>
              <p class="mt-2">
                3. 计算k
                <katex class="katex-sm" formula="k = hash512(R || H_A || m)" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  其中R为第1步中前32个字节, H<sub>A</sub>为 A的公钥, m签名的消息
                </span>
              </p>
              <p class="mt-2">
                4. 计算RKA
                <katex class="katex-sm" formula="RKA = R + H_A * k" />
                <br />
                <span class="text-sm pl-4 text-gray-400">
                  其中R为第1步中前32个字节, H<sub>A</sub>为 A的公钥, k为第3步的结果
                </span>
              </p>
              <p class="mt-2">5. 验证签名 RKA === SB 相等则验签成功</p>
              <!-- <p class="mt-2">
                <p>sign = 'xxx xxx'</p>
                <p>s = 小端字节序(sign(32, 64))</p>

                <p>A = puk</p>
                <p>R = sign(0, 32)</p>

                <p>SB = G * s</p>

                <p>k = hash512(R, A , msg)</p>
                <p>RKA = R + A * k</p>

                <p>RKA === SB</p>
              </p> -->
            </div>
          </div>
        </div>
      </div>
    </content-card>

    <cryptology-ed25519-sign @go-verify="updateVerifyData" />
    <cryptology-ed25519-verify ref="verifySignatureRef" />
  </div>
</template>
