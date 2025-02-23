<script lang="ts" setup>
const collapseVal = ref([
  // 'mod-diff',
  // 'mod-base',
  // 'add',
  // 'sub',
  // 'multiply',
  // 'mod-inverse',
  // 'mod-div',
])
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="模运算">
      <el-collapse v-model="collapseVal" class="collapse-bottom-border-none">
        <el-collapse-item name="mod-diff">
          <template #title>
            <h2 class="text-[16px] font-bold">取模运算 与 取余运算</h2>
          </template>
          <div class="leading-7 mb-6">
            <p>
              <span class="font-bold">取模运算</span>(多用于计算机)与
              <span class="font-bold">取余运算</span>(多用于数学概念) 有重叠当不完全一致，
            </p>
            <p>
              主要区别在于对
              <span class="font-bold">负整数进行除法运算时操作不同</span>, 对于正整数两者结果一致。
            </p>

            <p class="mt-2">
              <span class="font-bold">取模运算</span> 对于负数是
              <span class="font-bold">向负无穷的方向舍入</span>， 如 -7 % 4 = 1
            </p>
            <p class="indent-2">计算步骤:</p>
            <p class="indent-6">
              1. 求<span class="font-bold">整数商</span> c = a/b = -7/4 = -1.75 = -2 (
              <span class="font-bold">此时向负无穷的方向舍入！！</span>)
            </p>
            <p class="indent-6">2. 计算模和余数 m = a - b * c = -7 - (4 * -2) = 1</p>

            <p class="mt-2">
              <span class="font-bold">取余运算</span> 对于负数是
              <span class="font-bold">向0方向舍入</span>， 如 -7 % 4 =-3
            </p>
            <p class="indent-2">计算步骤:</p>
            <p class="indent-6">
              1. 求<span class="font-bold">整数商</span> c = a/b = -7/4 = -1.75 = -1 (
              <span class="font-bold">此时向0方向舍入！！</span>)
            </p>
            <p class="indent-6">2. 计算模和余数 m = a - b * c = -7 - (4 * -1) = -3</p>
            <p class="danger-box my-2">可以看出主要是计算出商的结果 导致取模和取余的结果不一致</p>
            <div class="success-box">
              <p>
                不同的编程语言 %运算符的含义也有所不同, 比如c/c++, java, javascript 为取余,
                而python则为取模
              </p>
              <p class="indent-6">即 python中执行 -7 % 4 结果是 1</p>
              <p class="indent-6">javascript 中执行 结果是-3</p>

              <p>取模运算的结果一定是<b>非负数</b></p>
              <p class="indent-6">
                对应 % 是<b>取余运算</b>的编程语言 可以使用 <b class="text-lg">【</b>
                <span class="text-[10px]">
                  <katex class="m-0" formula="a \% p = (a \bmod p + p) \bmod p" />
                </span>
                <b class="text-lg">】</b> 来转成取模运算
              </p>
              <p class="indent-10">例如 -7 % 4 = ((-7 % 4) +4) %4 = 1 (在javascript环境下的%)</p>
              <p class="indent-6">
                对应 % 是<b>取模运算</b>的编程语言 可以使用 <b class="text-lg">【</b>
                <span class="text-[10px]">
                  <katex class="m-0" formula="a \% p = a - \text{(a/p的商,不是余数)} * p" />
                </span>
                <b class="text-lg">】</b> 来转成取余运算
              </p>
              <p class="indent-10">
                例如 -7 % 4 = -7 - (-7 /4 的商, -1.75 向0方向舍入, 即 -1 ) *4 = -3
                (在python环境下的%)
              </p>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="mod-base">
          <template #title>
            <h2 class="text-[16px] font-bold">基本性质</h2>
          </template>
          <div>
            <h2 class="text-[14px] font-bold">前置知识点:</h2>
            <ul class="pl-6 mb-2">
              <li class="list-disc">
                <p>
                  p | a 表示 p <b>能整除(即余数0)</b> a，即 a 是 p 的倍数。 例如: 7|21 、 5|20 、
                  <span class="line-through">3 |10 (因为3不能整除10)</span>
                </p>
              </li>
              <li class="list-disc">
                <p>
                  同余数: 正整数a, b对p取模, 它们的<span class="font-bold">余数相同</span>, 记做
                  <span class="text-[12px]"><katex class="m-0" formula="a ≡ b\ \%\ p" /></span> 或者
                  <span class="text-[12px]"><katex class="m-0" formula="a ≡ b\ (\bmod\ p)" /></span>
                  <span class="text-[#f56c6c]">
                    (ps: 注意"≡", a ≡ b mod p ,对应的是 a mod p = b mod p )
                  </span>
                </p>
              </li>
              <li class="list-disc">
                <p>
                  正负只有除数相关: n % p 正负由被除数n决定,与p无关, 例
                  <span>7 % 4 = 3, -7 % 4 = -3, 7 % -4 = 3, -7 % -4 = -3</span>
                </p>
              </li>
            </ul>
            <h2 class="text-[14px] font-bold">性质:</h2>
            <ul class="pl-6 mb-2">
              <li class="list-disc">
                <p>
                  若 p|(a-b), 则 a ≡ b mod p。 例如 "7|(11-4)" 等同 "11 ≡ 4 mod 7" 即 "11 mod 7 = 4
                  mod 7"
                </p>
              </li>
              <li class="list-disc">
                a ≡ b(mod n) 的充要条件(充分必要) a - b = n * x, 其中x是未知数, 即 a-b 是 n 的倍数
              </li>
              <li class="list-disc text-gray-400">自反性: 所有实数a, 都有 "a ≡ a (mod n)"</li>
              <li class="list-disc text-gray-400">对称性: 若 "a ≡ b (mod n)", 则"b ≡ a (mod n)"</li>
              <li class="list-disc">传递性: 若"a ≡ b mod p" 且 "b ≡ c mod p" ，则 "a ≡ c mod p"</li>
            </ul>

            <p class="mt-6">模运算的实际应用:</p>
            <p class="indent-6">时钟 17点是几点? 17 % 12 = 5, 下午5点</p>
            <p class="indent-6">奇偶数判断: x % 2 结果 0 则是偶数 1 则是奇数</p>
            <p class="indent-6">
              素数的判断 x % {0,1,...i} 遍历，如果有 取模等于0时非1或者本身, 则是非素数
            </p>
            <p class="indent-6">...</p>
          </div>
        </el-collapse-item>

        <el-collapse-item name="add">
          <template #title>
            <h2 class="text-[16px] font-bold">模加法(Modulo Addition)</h2>
          </template>
          <p class="text-[12px] indent-6">
            <katex formula="(a+b) \bmod p = ((a \bmod p) + (b \bmod p)) \bmod p " />
          </p>
        </el-collapse-item>

        <el-collapse-item name="sub">
          <template #title>
            <h2 class="text-[16px] font-bold">模减法(Modulo Subtraction)</h2>
          </template>
          <p class="text-[12px] indent-6">
            <katex formula="(a-b) \bmod p = ((a \bmod p) - (b \bmod p)) \bmod p" />
          </p>
          <div class="danger-box mt-6">
            <p>
              <span class="emoji-span pr-2">⚠️</span>由于 "a - b" 可能是负数，所以可以加上 "+p"
              以确保结果非负
            </p>
            <p class="text-[12px] indent-6">
              <katex formula="(a-b) \bmod p = ((a \bmod p) - (b \bmod p)+p)  \bmod p " />
            </p>
          </div>
        </el-collapse-item>

        <el-collapse-item name="multiply">
          <template #title>
            <h2 class="text-[16px] font-bold">模乘法(Modulo Multiplication)</h2>
          </template>
          <p class="text-[12px] indent-6">
            <katex formula="(a \times b) \bmod p = ((a \bmod p) \times (b \bmod p)) \bmod p " />
          </p>
          <div class="danger-box mt-6">
            <p>
              <span class="emoji-span pr-2">⚠️</span> 注意 上面的 加法、减法、乘法 公式最终都得 再
              <span class="font-bold">mod p</span>
            </p>
            <p>
              例如: 加法运算 当 a = 7, b = 8, p = 10 如果 右侧的
              <span class="text-[12px]"> <katex formula="(a \bmod p) + (b \bmod p)" /></span> 超过 p
              时，等式不成立
            </p>
          </div>
        </el-collapse-item>

        <el-collapse-item name="mod-inverse">
          <template #title>
            <h2 class="text-[16px] font-bold">⭐️ 模乘法逆元(Modular Inverse)</h2>
          </template>
          <p>
            <span class="text-[12px] px-2"><katex formula="a * x ≡ 1 (\bmod p)" /></span>
            其中 x 称为 a在模p下的<b>逆元</b>
            <span class="text-[#f56c6c]">(前提条件是a 和 p需互质(互素)！)</span>
            即
            <span class="text-[12px] px-2">
              <katex formula="a^{-1} ≡ x (\bmod p) \iff a^{-1} \bmod p = x \bmod p"
            /></span>
          </p>
          <p class="font-bold text-[14px] mt-2">原理:</p>
          <p class="indent-4">
            如果 a = 3, p = 5的情况下
            <span class="text-[12px] px-2"><katex formula="3 * x ≡ 1 (\bmod\ 5) " /></span>
          </p>
          <p class="indent-4">
            根据<b>自反性</b>
            <span class="text-[12px] px-2"><katex formula="a ≡ a (\bmod\ n)" /></span>, 可得
            <span class="text-[12px] px-2"><katex formula="x = 3^{-1}" /></span>
            因为
            <span class="text-[12px] px-2"><katex formula="1 ≡ 1 (\bmod\ 5)" /></span>
            即
            <span class="text-[12px] px-2"><katex formula="3 * 3^{-1} ≡ 1 (\bmod\ 5)" /></span>
          </p>
          <p class="indent-4">
            此时 只要找到一个<b class="font-bold">正整数 x</b> 使
            <span class="text-[12px] px-2"><katex formula="3 * x ≡ 1 (\bmod 5)" /></span>
            即可 替代掉 <span class="text-[12px] px-2"><katex formula="3^{-1}" /></span>
          </p>
          <p class="indent-4">
            可以计算的出 x = 2 满足该 条件
            <span class="text-[12px] px-2"><katex formula="3 * 2 \bmod\ 5 = 1" /></span>
          </p>
          <p class="indent-4">
            1 mod 任何数都为1, 可得
            <span class="text-[12px] px-2">
              <katex formula="3 * 2 \bmod\ 5 = 1 \bmod 5 \iff 3 * 2 ≡ 1 (\bmod\ 5)" />
            </span>
          </p>
          <p class="indent-4">
            最终 : <span class="text-[12px] px-2"><katex formula="3 * 2 ≡ 1 (\bmod\ 5)" /></span> 和
            <span class="text-[12px] px-2"><katex formula="3 * 3^{-1} ≡ 1 (\bmod\ 5)" /></span>
            可以看出 此时
            <span class="text-[12px] px-2"><katex formula=" 2 和 3^{-1}" /></span> 可平替
          </p>
          <p class="font-bold text-[14px] mt-2">性质:</p>
          <p>互为逆元: a 在 模p 下 有逆元 x， 那么 x在模p下逆元即是 a</p>
          <p>
            逆元唯一: a 在 模p 下乘法逆元是唯一的， 如 模5 下 2 和3 互为逆元，且没有别的逆元了！！
          </p>
          <p>逆元可能是本身:</p>
          <p class="indent-4">如 1在不管模哪个整数，都以自己为逆元;</p>
          <p class="indent-4">模5的情况下, 4 * 4等于1, 即 模5下 4的乘法逆元即为本身;</p>
          <p class="indent-4">模4的情况下 3 * 3等于1, 即 模4下 3的乘法逆元为本身</p>
          <p class="text-[#f56c6c]">
            乘法逆元不一定存在，需 “gcd(a,p) =1” ,即a和 p最大公约数是1(互素), 模n下才会有
            a的乘法逆元
          </p>
          <p class="indent-4">
            例如 2 * x ≡ 1 (mod 4), 此时 在模4下 不存在2的乘法逆元
            <span>1 mod 4则 一定是奇数， 而 2 * x 一定是偶数 所以该条件不成立</span>
          </p>

          <p class="font-bold text-[14px] mt-2">求模逆:</p>
          <p>1. 扩展的欧几里得算法</p>
          <p class="indent-4">
            设a和b的最大公约数是d即 `gcd(a,b) = d` 那么一定存在两个数 s 和t 使得
            <span class="text-[12px] px-2"><katex formula="a * s + b * t = d" /></span>
            即
            <span class="text-[12px] px-2"><katex formula="gcd(a, b) = a * s + b * t" /></span>
            扩展的欧几里得算法就是 为了算出 这个 s 和 t
          </p>
          <p class="indent-4">
            回到求模逆，前提条件就需要 `gcd(a,p) = 1` 代入
            <span class="text-[12px] px-2"><katex formula="a * s + p * t = 1" /></span>
          </p>
          <p class="indent-4">
            此时两边同时进行 模 p 处理可得
            <span class="text-[12px] px-2">
              <katex formula="(a * s + p * t) \bmod p = 1 \bmod\ p" />
            </span>

            此时 p * t 正好是 p的整数倍 mod p后就得0了, 所以简化后
            <span class="text-[12px] px-2">
              <katex formula="a * s \bmod p = 1 \bmod\ p" />
            </span>
          </p>
          <p class="indent-4">可以 看出 模 n 下a的逆元就是 s，使用扩展的欧几里得算法可求出s</p>

          <p>2. 快速幂法(费马定理)</p>
          <p class="indent-4">待定...</p>
        </el-collapse-item>

        <el-collapse-item name="mod-div">
          <template #title>
            <h2 class="text-[16px] font-bold">模除法(Modulo Multiplication)</h2>
          </template>
          <p>
            要计算：<span class="text-[12px] px-2"><katex formula="\frac{a}{b} \mod p" /> </span>
            由于 不能直接除法，可以转换为 乘法：
            <span class="text-[12px] px-2">
              <katex formula="\left( a \times b^{-1} \right) \mod p \iff" />
            </span>
            其中<span class="text-[12px] px-2"><katex formula=" b^{-1}"></katex></span> 是 b 在模 p
            下的乘法逆元。
          </p>
          <p class="indent-4">
            例如:
            <span class="text-[12px] px-2"><katex formula="(14/4) \bmod 5"></katex></span>
            可化简为<span class="text-[12px] px-2"
              ><katex formula="7 * 2^{-1} \bmod 5"></katex
            ></span>
            此时 根据模逆
            <span class="text-[12px] px-2"><katex formula="2 * 3 ≡ 1\bmod 5"></katex></span>
          </p>
          <p class="indent-4">
            可得
            <span class="text-[12px] px-2"><katex formula="7 * 3 \bmod 5"></katex></span>
            最终结果为 1
          </p>
        </el-collapse-item>
      </el-collapse>
    </content-card>
  </div>
</template>
