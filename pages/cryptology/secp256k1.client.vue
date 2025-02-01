<script setup lang="ts">
import functionPlot from 'function-plot'

onMounted(() => {
  secp256k1Plot()
})

function secp256k1Plot() {
  functionPlot({
    target: '#secp256k1',
    grid: true,
    tip: {
      renderer(x, y) {
        return `(${formatTooltip(x)}, ${formatTooltip(y)})`
      },
      xLine: true,
      yLine: true,
    },
    data: [
      {
        fn: `sqrt(x^3+7)`,
        color: '#F56C6C',
      },
      {
        fn: `-sqrt(x^3+7)`,
        color: '#F56C6C',
      },
    ],
  })
}

watchEffect(() => {
  secp256k1Plot()
})

const formatTooltip = (val: number) => {
  return Math.floor(val * 100) / 100
}
</script>
<template>
  <div class="flex flex-wrap gap-6 p-6 secp256k1">
    <div class="flex flex-col p-10 border rounded">
      <h1 class="text-center font-bold">Secp256k1</h1>
      <p class="text-sm py-2">Secp256k1是一条特定的椭圆曲线</p>

      <ul class="pl-6">
        <li class="list-disc">
          Sec 是 Standards for Efficient Cryptography(高效密码学标准) 的缩写
        </li>
        <li class="list-disc">p 是素数 prime 的缩写, 256 表示素数是 256 位</li>
        <li class="list-disc">k 表示 Koblitz 曲线的缩写, 1 表示是第一个具有这些特征的曲线</li>
      </ul>
      <p class="text-sm py-2">
        在 Secp256k1 椭圆曲线方程中
        <span class="text-[12px] mr-1"><katex formula="a = 0, b = 7" /></span>
        即为:
        <span class="text-[12px]"><katex formula="y^2=x^3+7\mod \ p" /></span>
      </p>
      <p>
        <span class="font-bold text-red-500">实数域的曲线 </span>
        <span class="text-[12px]"><katex formula="y^2=x^3+7" /></span>
        如下:
      </p>
      <div id="secp256k1"></div>

      <div>
        <span class="font-bold text-red-500">有限域域的曲线 </span>
        <span class="text-[12px]"><katex formula="y^2=x^3+7\mod p" /></span>
      </div>

      <h1 class="font-bold text-lg py-2">一些常量</h1>
      <ul class="pl-6">
        <li class="list-disc">
          <div class="mt-1">
            <span class="text-[12px]">
              <katex formula="p=2^{256} - 2^{32} - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 -1" />
            </span>
            转为16进制
            <!--  -->
          </div>
          <el-alert type="success" :closable="false" class="mt-2">
            <div>
              <radix-box
                radix-prefix="0x"
                num-data="FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F"
              />
            </div>
          </el-alert>
        </li>
        <li class="list-disc">
          <div>基点 G 的坐标</div>
          <el-alert type="success" :closable="false" class="mt-2">
            <p class="flex items-center">
              <span class="min-w-[36px] font-bold">Gx =</span>
              <radix-box
                radix-prefix="0x"
                num-data="79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"
              />
              <!-- 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798 -->
            </p>
            <p class="flex items-center">
              <span class="min-w-[36px] font-bold">Gy =</span>
              <radix-box
                radix-prefix="0x"
                num-data="483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8"
              />
              <!-- Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8 -->
            </p>
          </el-alert>
        </li>

        <li class="list-disc">
          <div>基点 G 的阶 n</div>
          <el-alert type="success" :closable="false" class="mt-2">
            <p class="flex items-center">
              <span class="min-w-[30px] font-bold">n =</span>
              <radix-box
                radix-prefix="0x"
                num-data="FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
              />
              <!-- 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798 -->
            </p>
          </el-alert>
        </li>
      </ul>

      <p class="font-bold my-2">从 [1, n-1] 中选择一个随机数 k 作为私钥, 而公钥 H = k * G</p>

      <p>
        在bitcoin中Secp256k1用于
        <span class="font-bold">生成公钥</span>
        和
        <span class="font-bold">签名数据</span>
      </p>

      <!-- <el-descriptions :column="1" size="small" label-width="140">
        <el-descriptions-item
          label="x = 0, y = 1"
          label-class-name="font-bold relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-black"
        >
        </el-descriptions-item>
        <el-descriptions-item
          label="a > 1, y单调递增: "
          label-class-name="font-bold relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-black"
        >
          <div class="inline-block pl-1">
            <el-slider
              class="red-bar"
              size="small"
              v-model="incrementalFunVal"
              :format-tooltip="formatTooltip"
              :min="2"
              :max="10"
              :step="0.01"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item
          label="0 < a < 1, y单调递减: "
          label-class-name="font-bold relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-black"
        >
          <div class="inline-block pl-1">
            <el-slider
              class="green-bar"
              size="small"
              v-model="decreaseFunVal"
              :format-tooltip="formatTooltip"
              :max="1"
              :min="0.01"
              :step="0.01"
            />
          </div>
        </el-descriptions-item>
      </el-descriptions> -->
    </div>
  </div>
</template>

<style>
.secp256k1 .katex-display {
  margin: 0;
}
</style>
