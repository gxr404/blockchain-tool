<script lang="ts" setup>
const asciiChar = ref('')
const asciiCharErrorMsg = ref('')
const bytes = ref('')
const bytesError = ref(false)
const bytesErrorMsg = ref('')
const isShowMore = ref(false)

function onBytesInput() {
  resetErr()
  if (bytes.value.length % 2) {
    bytesError.value = true
    bytesErrorMsg.value = '一个完整的字节由两位十六进制数字组成'
    return
  }
  const bytesArr = bytes.value.match(/../g) || []
  asciiChar.value = bytesArr
    .map((bytes) => {
      return String.fromCharCode(Number(`0x${bytes}`))
    })
    .join('')
}
// 7b2270223a226272632d3230222c226f70223a226d696e74222c227469636b223a2273617473222c22616d74223a223130227d
function onAsciiInput() {
  resetErr()
  const hexArr = asciiChar.value.split('').map((char, index) => {
    const code = asciiChar.value.charCodeAt(index)
    return code.toString(16)
  })
  bytes.value = hexArr.join('')
}
function resetErr() {
  bytesError.value = false
  asciiCharErrorMsg.value = ''
}
const bytesCharArr = computed(() => {
  const bytesArr = bytes.value.match(/../g) || []
  return bytesArr.map((byte) => {
    return {
      hex: byte,
      char: String.fromCharCode(Number(`0x${byte}`)),
    }
  })
})
</script>
<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Ascii Converter" description="字节(16进制)与 ascii字符之间的转换">
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="Bytes">
          <div class="inline-block w-[680px]">
            <el-input
              :class="bytesError ? 'error' : ''"
              v-model="bytes"
              clearable
              @input="onBytesInput"
            >
              <template #prepend>0x</template>
            </el-input>
          </div>
          <div class="mt-[12px] pr-[12px]" v-if="bytesError">
            <el-alert type="error" :closable="false">
              {{ bytesErrorMsg }}
            </el-alert>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="Ascii">
          <div class="inline-block min-w-[680px] align-middle">
            <el-input
              type="textarea"
              :rows="6"
              v-model="asciiChar"
              @input="onAsciiInput"
            ></el-input>
          </div>
        </el-descriptions-item>

        <el-descriptions-item v-if="bytes">
          <template #label>
            <span
              class="hover:text-[var(--color-primary)] underline cursor-pointer px-2"
              @click="
                () => {
                  isShowMore = !isShowMore
                }
              "
            >
              {{ isShowMore ? '隐藏' : '显示更多详情' }}
            </span>
          </template>
          <div class="w-[680px] inline-flex flex-wrap gap-2" v-show="isShowMore">
            <span
              class="flex items-center justify-center px-2"
              v-for="(item, index) in bytesCharArr"
              :key="`${item.hex}-${index}`"
            >
              <span
                class="inline-flex items-center justify-center border px-2 rounded min-w-[30px] min-h-[30px] text-[var(--color-primary)] bg-[var(--color-primary4)] border-[var(--color-primary5)]"
              >
                0x{{ item.hex }}
              </span>
              <span class="px-2">——></span>
              <span
                class="inline-flex items-center justify-center border px-2 rounded min-w-[30px] min-h-[30px] text-[var(--color-danger)] bg-[var(--color-danger4)] border-[var(--color-danger5)]"
              >
                {{ item.char }}
              </span>
            </span>
          </div>
          <div class="w-[680px] inline-flex flex-wrap gap-2"></div>
        </el-descriptions-item>
      </el-descriptions>
      <div class="mt-10">
        <el-collapse class="collapse-bottom-border-none">
          <el-collapse-item name="1">
            <template #title>
              <span class="font-bold">Ascii表</span>
            </template>
            <general-ascii-table />
          </el-collapse-item>
        </el-collapse>
      </div>
    </content-card>
  </div>
  <div class="p-10">
    <div></div>
  </div>
</template>
