<script lang="ts" setup>
import asciiData from '~/public/ascii.json'

interface IAsciiItem {
  ascii: string
  binary: string
  decimal: string
  hex: string
  isControlChar: boolean
}

function sliceData(arr: IAsciiItem[], col: number) {
  const len = arr.length
  const sep = Math.floor(len / col)
  let remainder = len % col
  const res = []
  let start = 0
  for (let i = 0; i < col; i++) {
    const end = start + sep + (remainder ? 1 : 0)
    res.push(arr.slice(start, end))
    start = end
    remainder = remainder > 0 ? remainder - 1 : 0
  }
  return res
}

const renderTable = sliceData(asciiData, 3)

function rowClassName({ row }: { row: IAsciiItem }) {
  return row.isControlChar ? 'control' : ''
}
</script>
<template>
  <div class="mt-2">
    <p class="text-sm text-gray-400">用于显示字符编号范围是32~126(0x20-0x7E),共95个字符</p>
    <p class="text-sm text-gray-400 mb-[10px]">
      用于操作/控制字符范围是0~31和127(0x00-0x1F和0x7F),共33个字符, 表中有背景色的即是
    </p>
    <div class="flex flex-wrap gap-2 mt-6">
      <el-table
        v-for="(list, index) in renderTable"
        :data="list"
        border
        :key="`list-${index}`"
        class="flex-1 min-w-[360px] rounded-sm"
        :row-class-name="rowClassName"
      >
        <el-table-column prop="decimal" label="Decimal" align="center" />
        <el-table-column prop="hex" label="Hex" align="center" width="80" />
        <el-table-column
          prop="binary"
          label="Binary"
          align="center"
          :formatter="(row: any, column: any, value: any) => value.match(/..../g).join(' ')"
        />
        <el-table-column prop="ascii" label="Char" align="center" />
      </el-table>
    </div>
  </div>
</template>
<style>
.control {
  background-color: var(--c-ascii-table-bg) !important;
  color: #409eff !important;
  /* --el-table-border: 1px solid #409eff; */
}
</style>
