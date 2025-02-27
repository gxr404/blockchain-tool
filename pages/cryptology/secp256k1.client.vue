<script setup lang="ts">
import functionPlot from 'function-plot'

onMounted(() => {
  secp256k1Plot()
  secp256k1FinitePlot()
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

function secp256k1FinitePlot() {
  const points = countSecp256k1Finite(11)
  const getTextLabelList = points.map(([x, y]) => {
    return {
      graphType: 'text' as const,
      location: [x, y] as [number, number],
      text: `(${x}, ${y})`,
      attr: {
        fill: '#F56C6C',
      },
    }
  })
  functionPlot({
    target: '#secp256k1-finite',
    grid: true,
    tip: {
      renderer(x, y) {
        return `(${formatTooltip(x)}, ${formatTooltip(y)})`
      },
      xLine: true,
      yLine: true,
    },
    xAxis: {
      domain: [-1, 12],
    },
    yAxis: {
      domain: [-1, 12],
    },
    data: [
      {
        points,
        fnType: 'points',
        graphType: 'scatter',
        color: 'red', //'#F56C6C',
      },
      ...getTextLabelList,
    ],
    disableZoom: true,
  })
}

/** 该函数 没用BigNumber 不支持过大的值  */
function countSecp256k1Finite(p: number) {
  const pointList = []
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      const isEccPoint = checkEccPoint('0', '7', String(p), {
        x: String(i),
        y: String(j),
      })
      if (isEccPoint) {
        pointList.push([i, j])
      }
    }
  }
  return pointList
}

// watchEffect(() => {
//   secp256k1Plot()
// })

const formatTooltip = (val: number) => {
  return Math.floor(val * 100) / 100
}
</script>
<template>
  <div class="flex flex-wrap gap-10 p-10 secp256k1">
    <content-card title="Secp256k1" :tag-data="['bitcoin', 'ethereum']" title-large>
      <p class="text-sm py-2">Secp256k1是一条特定的椭圆曲线</p>

      <ul class="pl-6">
        <li class="list-disc">
          Sec 是 Standards for Efficient Cryptography(高效密码学标准) 的缩写
        </li>
        <li class="list-disc">
          p 是素数 prime 的缩写, 256 表示素数是 256 位
          <span class="text-sm text-gray-400"
            >(所以使用该算法得到的点坐标都是256位Bit(64个16进制字符))</span
          >
        </li>
        <li class="list-disc">k 表示 Koblitz 曲线的缩写, 1 表示是第一个具有这些特征的曲线</li>
      </ul>
      <div class="py-2">
        <p class="text-sm">
          在 Secp256k1 椭圆曲线方程中
          <span class="text-[12px] mr-1 text-[#F56C6C]"><katex formula="a = 0, b = 7" /></span>
        </p>
        <p class="text-sm">
          代入椭圆曲线方程后即为:
          <span class="text-[12px] text-[#F56C6C]"
            ><katex formula="y^2 \equiv x^3+7 \bmod p"
          /></span>
        </p>
      </div>
      <div class="my-2">
        <p>
          <span class="font-bold text-[#F56C6C]">实数域的曲线方程 </span>
          <span class="text-[12px] mx-2"><katex formula="y^2=x^3+7" /></span>
          如下:
        </p>
        <div id="secp256k1"></div>

        <div class="mt-4">
          <span class="font-bold text-[#F56C6C]">有限域的曲线方程 </span>
          <span class="text-[12px] mx-2"><katex formula="y^2 \equiv x^3+7\bmod p" /></span>
          平面直角坐标系为一些分散的点组成，如下:
        </div>

        <div id="secp256k1-finite"></div>
        <div class="text-sm indent-6 mt-4">
          这里<b>为了演示p取11</b>而非Secp256k1中规定的
          <katex class="katex-sm" formula="p=2^{256} - 2^{32} - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 -1" />
          <span class="text-gray-400">(否则算出来的点会是256Bit的大数字)</span>
        </div>
      </div>
      <h1 class="font-bold py-2 mt-4">Secp256k1中常量</h1>
      <ul class="pl-6">
        <li class="list-disc">
          <div class="mt-1">
            <span class="text-[12px]">
              <katex formula="p=2^{256} - 2^{32} - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 -1" />
            </span>
            转为16进制
            <!--  -->
          </div>
          <div class="my-2 w-[690px]">
            <radix-box
              default-radix="0x"
              num-data="FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F"
            />
          </div>
        </li>
        <li class="list-disc">
          <div>基点 G 的坐标</div>
          <div class="flex items-center mt-2">
            <span class="min-w-[36px] font-bold pr-2">Gx =</span>

            <p class="flex items-center">
              <radix-box
                default-radix="0x"
                num-data="79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"
              />
              <!-- 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798 -->
            </p>
          </div>
          <div class="flex items-center my-2">
            <span class="min-w-[36px] font-bold pr-2">Gy =</span>

            <p class="flex items-center">
              <radix-box
                default-radix="0x"
                num-data="483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8"
              />
              <!-- Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8 -->
            </p>
          </div>
        </li>

        <li class="list-disc">
          <div>基点 G 的阶 n</div>
          <div class="flex items-center my-2">
            <span class="min-w-[30px] font-bold pr-2">n =</span>

            <p class="flex items-center">
              <radix-box
                default-radix="0x"
                num-data="FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
              />
              <!-- 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798 -->
            </p>
          </div>
        </li>
      </ul>

      <p>
        在bitcoin中Secp256k1用于
        <span class="font-bold">生成公钥</span>
        和
        <span class="font-bold">签名数据</span>
      </p>

      <!-- <p class="text-sm text-gray-400 mb-[10px]">
        在bitcoin中Secp256k1应用于 <b>生成公钥</b>和 <b>交易时生成签名</b>
      </p> -->

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
    </content-card>
  </div>
</template>

<style>
.secp256k1 .katex-display {
  margin: 0;
}
</style>
