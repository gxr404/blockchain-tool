<script lang="ts" setup>
import { disabledOpcodes, opcodes, opcodeGroups } from '~/utils/opcode/opcodes'
import { opcodeDescription } from '~/utils/opcode/opcodes-description'
import { Select, CloseBold } from '@element-plus/icons-vue'

function genTableGroup() {
  return opcodeGroups.map((item) => {
    const data = item.opcodes.map((opcodeName) => {
      return {
        opcodeName,
        isValid: !disabledOpcodes.includes(opcodeName),
        opcode: opcodes[opcodeName],
        description: opcodeDescription[opcodeName],
      }
    })

    return {
      title: item.title,
      data,
    }
  })
}
</script>
<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card v-for="item in genTableGroup()" :key="item.title" :title="item.title">
      <el-table :data="item.data" border>
        <el-table-column prop="opcode" label="操作码" width="80px" />
        <el-table-column prop="isValid" label="有效性" width="80px" align="center">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <Select
                v-if="scope.row.isValid"
                class="w-[16px] h-[16px] text-[var(--color-success)]"
              />
              <CloseBold v-else class="w-[16px] h-[16px] text-[var(--color-danger)]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="opcodeName" label="名称" width="200px" />
        <el-table-column prop="description" label="描述">
          <template #default="scope">
            {{ scope.row.description || '-' }}
          </template>
        </el-table-column>
      </el-table>
    </content-card>
  </div>
  <!--
  <div class="p-10">
    <div class="w-[860px]">
      <div v-for="item in genTableGroup()" :key="item.title" class="mb-16">
        <h1 class="text-lg font-bold my-4">{{ item.title }}</h1>
        <el-table :data="item.data" border>
          <el-table-column prop="opcode" label="操作码" width="80px" />
          <el-table-column prop="isValid" label="有效性" width="80px" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <Select v-if="scope.row.isValid" class="w-[16px] h-[16px] text-[var(--color-success)]" />
                <CloseBold v-else class="w-[16px] h-[16px] text-[var(--color-danger)]" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="opcodeName" label="名称" width="200px" />
          <el-table-column prop="description" label="描述">
            <template #default="scope">
              {{ scope.row.description || '-' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div> -->
</template>
