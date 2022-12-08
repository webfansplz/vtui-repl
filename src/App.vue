<script lang="ts" setup>
import type { KeyDataEvent } from 'vue-termui'
import { isKeyDataEvent } from 'vue-termui'
import Input from '@/components/Input.vue'
import Output from '@/components/Output.vue'
const input = ref('')

watch(input, () => {
  input.value = input.value.replace(/\r/g, '\n')
})

const stop = onInputData(({ event }) => {
  if (isKeyDataEvent(event)) {
    if (event.ctrlKey) {
      // Exit
      if (event.key === 'C') {
        stop()
        process.exit(0)
      }
      // Clear Input
      else if (event.key === 'D') {
        input.value = ''
      }
    }
  }
})
</script>

<template>
  <div>
    <div class="flex-col">
      <div>
        <Input v-model="input" />
        <Output :content="input" />
      </div>
      <div class="border-gray justify-end w-100%">
        <span dimmed>
          [Ctrl+D] Clear Input
        </span>
      </div>
    </div>
  </div>
</template>
