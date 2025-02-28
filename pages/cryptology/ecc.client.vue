<script setup lang="ts">
import { Link } from '@element-plus/icons-vue'

const curveTable = [
  {
    name: 'Weierstrass',
    label: 'Short',
    // y^2=x^3+ax+b, 4a^3+27b^2\\neq0
    formula: 'y^2=x^3+ax+b',
    application: 'ECDSA(签名)、ECDH(密钥交换)',
    example: 'ecp256k1(比特币)、secp256r1(TLS)',
  },
  {
    name: 'Montgomery',
    formula: 'By^2 = x^3 + Ax^2 + x',
    application: '高效密钥交换(X25519)',
    example: 'Curve25519(X25519) 、Curve448(X448)',
  },
  {
    name: 'Edwards',
    formula: 'x^2 + y^2 = 1 + d x^2 y^2',
    description: '其中d不等于 0, 1 （避免退化为其他曲线）',
    application: '高效签名(Ed25519)',
    example: 'Ed25519、Ed448',
  },
  {
    name: 'Twisted Edwards',
    formula: 'ax^2 + y^2 = 1 + d x^2 y^2',
    description: '其中a和d都是非零的常数, a=1时退化为标准的Edwards强项',
    application: '高效签名(Ed25519)',
    example: 'Ed25519、Ed448',
  },
  {
    name: '...',
    formula: '...',
    description: '...',
    application: '...',
    example: '...',
  },
  // {
  //   name: '超奇异曲线',
  //   enName: '(Supersingular Isogeny Cryptography, SIKE) —— 双曲线',
  //   formula: 'y^2 = x^3 + ax',
  //   application: '抗量子加密',
  //   example: 'SIKE(超奇异同态加密)'
  // },
  // {
  //   name: 'Koblitz曲线',
  //   enName: '(Supersingular Isogeny Cryptography, SIKE) —— 双曲线',
  //   formula: '--',
  //   textFormula: '特殊 Weierstrass 形式',
  //   application: '低功耗设备',
  //   example: 'secp256k1、secp160k1'
  // }
  // Montgomery curves  蒙哥马利曲线
  // Edwards curves  爱德华兹曲线
  // Hessian curves  黑森州曲线
  // Twisted curves  扭曲的曲线
  // Twisted Hessian curves  扭曲的Hessian曲线
  // Twisted Edwards curve  扭曲的爱德华兹曲线
  // Doubling-oriented Doche–Icart–Kohel curve  面向加倍的doche-icart-kohel曲线
  // Tripling-oriented Doche–Icart–Kohel curve 面向三元的doche-icart-kohel曲线
  // Jacobian curve  雅各布曲线
  // BLS: Barreto-Lynn-Scott curves
]
</script>

<template>
  <div>
    <div class="pt-6 px-6">
      <a
        class="underline text-[var(--color-primary)] hover:text-[var(--color-primary2)]"
        target="_blank"
        href="https://bitcoin.heapup.tech/cryptology/ecc/ecc"
      >
        <Link class="w-[16px] h-[16px] inline-block align-middle" />
        <span class="font-bold">&nbsp;建议看 bitcoin ninja 的ecc</span>
      </a>
    </div>
    <div class="flex flex-wrap gap-10 p-10">
      <cryptology-ecc-base />
      <cryptology-finite-field-ecc />
      <!-- 公钥计算 -->
      <content-card title="公钥计算">
        <p class="my-2">在椭圆曲线加密算法中，给定椭圆曲线E 和 曲线上的基点 G。</p>
        <p class="text-sm">计算出 G 的阶为 n, 之后在 {1, ..., n-1}中随机选择一个整数 k 作为私钥</p>
        <p class="text-sm">
          公钥 <b>H = k * G</b>, H是曲线上的一个点, G是基点,
          k则是256位的随机数(即求的是点倍乘的结果)
        </p>
        <p class="text-sm">为什么 ECC 安全性高?</p>
        <div class="pl-4 text-sm leading-6">
          <p>在已知 H 和 G 的情况下，计算 k 是非常困难的。(即公钥反推私钥)</p>
          <p>因为计算 k 并不能用简单的线性运算 k= G/H 求出结果。(因为是点倍乘的运算)</p>
          <p>H 是 k 个 G 相加的结果, 这种加法的计算并不是简单的代数运算。</p>
          <p>如果直接给出一个点 H, 无法直接计算是由多少 k 个 G 点相加的结果。</p>
          <p>只能从 1G,2G,3G,... 如此不断地尝试, 直到结果等于 H, 才能得到 k。</p>
          <p>
            当 k 是一个很大的数时, 这个过程的难度将变的非常大, 即使以现在最快的计算机,
            尝试所有可能的 k 值也需要远超过宇宙年龄的时间。
          </p>
        </div>
        <p class="font-bold my-2">
          总结即是: 从 [1, n-1] 中选择一个随机数 k 作为私钥, 而公钥 H = k * G
        </p>
      </content-card>

      <content-card title="椭圆曲线的分类">
        <div class="py-2">
          <ul class="pl-4">
            <li class="list-disc mb-2">
              <p class="text-sm">
                <span class="font-bold">短的</span>Weierstrass(Short Weierstrass Form):
                适用大多数有限域上的椭圆曲线
              </p>
              <p class="pt-2"><katex class="katex-sm" formula=" y^2 = x^3 + ax + b" /></p>
            </li>
            <li class="list-disc mb-2">
              <p class="text-sm">
                Weierstrass(General Weierstrass Form): 可以表示
                <span class="font-bold">所有的椭圆曲线</span>，包括 Montgomery 曲线和 Edwards 曲线
              </p>
              <p class="py-2">
                <katex
                  class="katex-sm"
                  formula="y^2 + a_1 xy + a_3 y = x^3 + a_2 x^2 + a_4 x + a_6"
                />
              </p>
              <p class="text-sm">
                短 Weierstrass 形式只是 Weierstrass 形式的一个特例，它是密码学中最常用的椭圆曲线方程
              </p>
            </li>
          </ul>
        </div>
        <div class="py-6 text-sm">
          <el-table :data="curveTable" class="text-sm" border>
            <el-table-column prop="name" label="曲线类型" width="160">
              <template #default="scope">
                <span>
                  {{ scope.row.name }}
                  <span v-if="scope.row.label" class="text-[12px] text-gray-400">
                    ({{ scope.row.label }})
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="说明" width="160" />
            <el-table-column label="方程形式">
              <template #default="scope">
                <katex class="katex-sm" :formula="scope.row.formula" />
              </template>
            </el-table-column>
            <el-table-column prop="application" label="适用场景" />
            <el-table-column prop="example" label="代表曲线" />
          </el-table>
        </div>

        <div class="primary-box !p-6">
          <!-- <p class="mb-2">不同曲线的点可以互相转换</p> -->
          <p class="mb-2">
            椭圆曲线有不同的表达形式, 他们是存在双有理等价(Birationally equivalent)
          </p>
          <p>如果两条曲线双有理等价意味着:</p>
          <ul class="pl-4">
            <li class="list-disc">
              <p>
                <span class="font-bold">可以相互转换</span>，并且
                <span class="font-bold">不会丢失信息</span>或
                <span class="font-bold">引入歧义</span>
              </p>
            </li>
            <li class="list-disc">
              每个曲线上的点在另一条曲线上都有<span class="font-bold">唯一对应点</span>
            </li>
          </ul>

          <hr class="my-4 border-[var(--color-primary)]" />
          <p class="mb-2">Weierstrass curve与Montgomery curve相互转换:</p>
          <div class="pl-4">
            <p class="mb-2">例如: Curve25519 ↔ Weierstrass</p>
            <p class="mb-2">
              <katex class="katex-sm" formula="(x,y)↦(u,v)=(B(x+A/3),\ B^2y)" />
            </p>
            <p class="mb-2">
              <katex class="katex-sm" formula="(u,v)↦(x,y)=(u/B−A/3, \ v/B^2)" />
            </p>
          </div>
          <hr class="my-4 border-[var(--color-primary)]" />
          <p class="mb-2">坐标 (u, v) 与 Twisted Edwards 坐标 (x, y) 之间的转换</p>
          <div class="pl-4">
            <p class="mb-2">例如: Curve25519 ↔ Edwards25519</p>
            <p class="mb-2">
              从 Montgomery 形式转换为 Twisted Edwards 形式<br />
              <katex class="katex-sm" formula="x = \frac{u}{v}, \quad y = \frac{u-1}{u+1}" />
            </p>
            <p class="mb-2">
              从 Twisted Edwards 形式转换为 Montgomery 形式<br />
              <katex class="katex-sm" formula="u = \frac{1+y}{1-y}, \quad v = \frac{u}{x}" />
            </p>
          </div>
          <hr class="my-4 border-[var(--color-primary)]" />

          <p class="mb-2">Edwards25519 ↔ Weierstrass</p>
        </div>

        <!-- 如果两条曲线 不是双有理等价，就意味着：
        •	信息可能丢失（例如，一个曲线的点可能无法在另一条曲线中找到对应点）。
        •	转换可能不可逆（例如，多个点映射到同一个点，导致转换丢失信息）。
        •	运算可能不保持一致（如群运算可能不一致）。 -->

        <!-- Ed25519 使用Curve25519的 Edwards 形式（签名更快）
          Curve25519 使用 Montgomery 形式（密钥交换更快）

        Curve25519
          Curve25519 (Montgomery 形式)	X25519	 u  坐标 (Montgomery)	密钥交换 (ECDH)
          Ed25519 (Edwards 形式)	EdDSA	 (x, y)  坐标 (Edwards)	数字签名 -->
      </content-card>

      <content-card title="椭圆曲线的应用">
        <ul class="pl-4">
          <li class="list-disc">
            <p>
              <span class="font-bold text-[var(--color-primary)]">数字签名</span>: 用于确
              <span class="font-bold">保数据的完整性</span> 和
              <span class="font-bold">身份验证</span> ，防止篡改和伪造
            </p>
            <div class="pl-4">
              <p>常见算法:</p>
              <ul class="pl-8">
                <li class="list-disc">ECDSA -> Bitcoin、Ethereum...</li>
                <li class="list-disc">EdDSA -> Solana...</li>
                <li class="list-disc">Schnorr -> Bitcoin Taproot</li>
                <li>...</li>
              </ul>
            </div>
          </li>
          <li class="list-disc">
            <p>
              <span class="font-bold text-[var(--color-primary)]">加密</span>:
              用于保护数据的机密性，确保只有 <span class="font-bold">授权方</span>能够读取数据内容
            </p>
            <div class="pl-4">
              <p class="text-sm">
                纯用ECC加密: ECIES（Elliptic Curve Integrated Encryption Scheme） 是 ECC
                直接用于加密的方案，但很少使用。 实际多用 ECDH + AES
              </p>
              <!-- <p>常见算法:</p>
              <ul class="pl-8">
                <li class="list-disc">ECC 加密(Elliptic Curve Cryptography) -> 替代 RSA...</li>
              </ul> -->
            </div>
          </li>

          <li class="pl-4">
            <p>数字签名和加密的区别</p>
            <div class="pl-4">
              <p>数据层面 —— "数字签名"中数据仍是明文, "加密"数据变成密文</p>
              <div>
                目的层面 ——
                <span>
                  "数字签名"是为了证明
                  <span class="font-bold">谁</span>发送了数据，并且确保数据没被篡改 </span
                >,
                <span>
                  "加密"是为了 <span class="font-bold">隐藏数据</span>，使未经授权的人无法读取
                </span>
              </div>
              <div>
                过程层面 ——
                <span> "数字签名" 发送方用私钥签名，接收方用公钥验证 </span>,
                <span> "加密" 发送方用接收方公钥加密，接收方用私钥解密 </span>
              </div>
              <div>
                验证层面 ——
                <span> "数字签名" <span class="font-bold">任何人</span>都可以使用公钥验证签名 </span
                >,
                <span> "加密" 只有授权的人（即持有对应私钥的人）才能解密并查看数据内容 </span>
              </div>
              <p class="pl-4">
                例如: 数字签名能确保数据确实是A发送的,
                即使有人窃取了A的签名数据转发给我们,我们仍然可以验证该数据是由A签署的
              </p>
              <p class="pl-4">
                例如: 如果 C 假冒 A 发送数据给 B, B 仅通过 "加密" 无法判断数据是否真正来自 A ,
                因为加密只保证数据的保密性，并不能证明发送者的身份
              </p>
            </div>
          </li>

          <li class="list-disc">
            <p>
              <span class="font-bold text-[var(--color-primary)]">密钥交换</span>:
              用于在通信双方之间安全地建立 <span class="font-bold">共享密钥</span>，防止中间人攻击。
            </p>
            <div class="pl-4">
              <p>常见算法:</p>
              <ul class="pl-8">
                <li class="list-disc">ECDH(Diffie-Hellman) -> TLS/VPN...</li>
                <li class="list-disc">X25519 -> TLS1.3/WhatsApp..</li>
              </ul>
            </div>
          </li>
          <li class="list-disc">...</li>
        </ul>
      </content-card>
    </div>
  </div>
</template>
