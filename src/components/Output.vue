<script setup lang="ts">
import { execa } from 'execa'
import SyntaxHighlight from '@vue-termui/syntax-highlight'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const output = ref('...')
let timer: NodeJS.Timer | null = null
let execTimer: NodeJS.Timer | null = null

async function exec() {
  try {
    const result = await execa('node', [
      '--no-warnings',
      // '-r',
      // 'ts-node/register',
      // '--loader',
      // 'ts-node/esm',
      '--experimental-json-modules', // use asserts {type :'json'} for import json file
      '--input-type=module',
      '-e',
    `"${props.content.replace(/"/g, '\'')}"`,
    ], {
      stdio: 'pipe',
      shell: true,
    })
    if (!result.exitCode)
      output.value = result.stdout ? result.stdout : '...'
  }
  catch (e: Error) {
    output.value = e.message
  }
}

watch(() => props.content, () => {
  clearTimeout(timer!)
  clearInterval(execTimer!)
  output.value = 'typing...'
  execTimer = setTimeout(() => {
    output.value = 'running...'
  }, 1000)
  timer = setTimeout(() => {
    exec()
  }, 2000)
})
</script>

<template>
  <div
    :padding="1"
    :minWidth="30"
    :minHeight="10"
    borderStyle="round"
    title="Output"
  >
    <SyntaxHighlight :code="output" lang="js" />
  </div>
</template>
