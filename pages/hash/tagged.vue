<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

import 'element-plus/es/components/message/style/css'

const tagPrefix = ref('')
const tagPrefixOptionName = ref('')
const isAddTagPrefixOption = ref(false)
const tagPrefixOptions = ref<string[]>([...TAGGED_HASH_TAGS])
const data = ref('')

function onAddOptionConfirm() {
  if (tagPrefixOptionName.value) {
    const newOption = tagPrefixOptionName.value.trim()
    if (tagPrefixOptions.value.includes(newOption)) {
      ElMessage.error('已存在的Tag Prefix')
      return
    }
    tagPrefixOptions.value.push(newOption)
    clear()
  }
}
function clear() {
  tagPrefixOptionName.value = ''
  isAddTagPrefixOption.value = false
}

const hashResult = computed(() => {
  if (!tagPrefix.value || !data.value) return ''
  return taggedHash(tagPrefix.value, data.value)
})

function copyHashResult() {
  if (!hashResult.value) return
  navigator.clipboard.writeText(hashResult.value)
  ElMessage.success('copy success')
}
</script>
<template>
  <div class="p-10">
    <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[960px]">
      <p class="font-bold text-lg">Tagged Hash</p>
      <p class="text-sm text-gray-400 mt-4">
        使用<b>标签前缀</b>创建数据哈希 (在传统哈希算法中添加标签来实现对不同数据类型的区分)
      </p>
      <p class="text-sm text-gray-400">
        应用在 <b>Schnorr签名</b>, <b>Schnorr验证</b> 和 <b>Taproot地址生成</b>...
      </p>
      <p class="text-sm text-gray-400 mt-2">
        Tagged Hash = SHA256(SHA256(Tag Prefix) + SHA256(Tag Prefix) + data)
      </p>

      <div class="mt-8">
        <el-descriptions label-width="100" :column="1">
          <el-descriptions-item label="Tag Prefix: ">
            <div class="inline-block w-[660px]">
              <el-select
                v-model="tagPrefix"
                placeholder="Select"
                size="large"
                @visible-change="(v) => (isAddTagPrefixOption = false)"
              >
                <el-option
                  v-for="item in tagPrefixOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <template #footer>
                  <el-button
                    v-if="!isAddTagPrefixOption"
                    text
                    bg
                    size="small"
                    @click="isAddTagPrefixOption = true"
                  >
                    自定义Tag Prefix
                  </el-button>
                  <template v-else>
                    <el-input v-model="tagPrefixOptionName" />
                    <div class="flex items-center justify-center mt-2">
                      <el-button type="primary" size="small" @click="onAddOptionConfirm">
                        确认
                      </el-button>
                      <el-button size="small" @click="clear">取消</el-button>
                    </div>
                  </template>
                </template>
              </el-select>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="Data: ">
            <div class="inline-block w-[660px]">
              <radix-input default-radix="0x" v-model:hex="data" disable-select />
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <div class="border-t my-2"></div>
          </el-descriptions-item>
          <el-descriptions-item label="Result: ">
            <div class="inline-block w-[660px] primary-box min-h-[40px] align-middle">
              {{ hashResult }}
              <span class="copy-btn" @click="copyHashResult" v-if="hashResult">
                <copy-document class="inline-block w-[16px] h-[16px]"></copy-document>
              </span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>
