<script lang="ts" setup>
import type { KeyDataEvent } from 'vue-termui'
import Input from '@/components/Input.vue'
import Output from '@/components/Output.vue'
const input = ref('')

// Exit the process manually when press ctrl + c
const stop = onInputData((e) => {
  const event = e.event as KeyDataEvent
  if (event!.key === 'C' && event!.ctrlKey) {
    stop()
    process.exit(0)
  }
})
</script>

<template>
  <div>
    <Input v-model="input" />
    <Output :content="input" />
  </div>
</template>
