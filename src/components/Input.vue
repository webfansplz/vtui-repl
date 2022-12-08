<script setup lang="ts">
import { computed, ref, toRef } from '@vue/runtime-core'
import SyntaxHighlight from '@vue-termui/syntax-highlight'
import { isInputDataEvent, isKeyDataEvent, onInputData, useFocus } from 'vue-termui'

const props = withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  {
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const { active, disabled } = useFocus({
  // @ts-expect-error: vue bug?
  disabled: toRef(props, 'disabled'),
  active: true,
})

// used for fallback value when no v-model
const localText = ref('')
const text = computed({
  get() {
    return props.modelValue ?? localText.value
  },
  set(value) {
    if (props.modelValue == null)
      localText.value = value

    else
      emit('update:modelValue', value)
  },
})
const cursorPosition = ref(text.value.length)
const showCursorBlock = ref(true)
const FULL_BLOCK = '\u{2588}' // '█'

const displayedValue = computed(() => {
  const textValue = text.value
  if (showCursorBlock.value && active.value) {
    return (
      textValue.slice(0, cursorPosition.value)
      + FULL_BLOCK
      + (textValue[cursorPosition.value] === '\n' ? '\n' : '')
      + textValue.slice(cursorPosition.value + 1)
      + (cursorPosition.value >= textValue.length ? '' : ' ')
    )
  }
  return `${textValue} `
})

function calcCursorPosition(index: number, type = 'prev') {
  let prev = index
  if (type === 'prev') {
    while (prev > 0 && text.value[prev - 1] !== '\n')
      prev -= 1

    return prev - 1 < 0 ? 0 : prev - 1
  }
  else {
    while (prev < text.value.length && text.value[prev + 1] !== '\n')
      prev += 1
    return prev + 1 > text.value.length ? text.value.length : prev + 1
  }
}

onInputData((evt) => {
  if (active.value && !disabled.value) {
    // windows only
    if (isInputDataEvent(evt)) {
      if (evt.data === '\b') {
        if (cursorPosition.value > 0) {
          text.value
              = text.value.slice(0, cursorPosition.value - 1)
              + text.value.slice(cursorPosition.value)
          cursorPosition.value--
        }
      }
    }
    if (isKeyDataEvent(evt.event)) {
      const event = evt.event
      switch (event.key) {
        case 'Enter':
          text.value = `${text.value.slice(0, cursorPosition.value)}` + '\n\n' + `${text.value.slice(cursorPosition.value + 1)}`
          nextTick(() => {
            cursorPosition.value = Math.min(
              text.value.length,
              cursorPosition.value + 1,
            )
          })
          break
        case 'ArrowUp':
          cursorPosition.value = calcCursorPosition(cursorPosition.value)
          break
        case 'ArrowDown':
          cursorPosition.value = calcCursorPosition(cursorPosition.value, 'next')
          break
        case 'ArrowLeft':
          cursorPosition.value = Math.max(0, cursorPosition.value - 1)
          break
        case 'ArrowRight':
          cursorPosition.value = Math.min(
            text.value.length,
            cursorPosition.value + 1,
          )
          break

        case 'Backspace':
          if (cursorPosition.value > 0) {
            text.value
              = text.value.slice(0, cursorPosition.value - 1)
              + text.value.slice(cursorPosition.value)
            cursorPosition.value--
          }
          break
        case 'e':
        case 'E':
          if (event.ctrlKey) {
            cursorPosition.value = text.value.length
            break
          }

        case 'a':
        case 'A':
          if (event.ctrlKey) {
            cursorPosition.value = 0
            break
          }

        case 'u':
        case 'U':
          if (event.ctrlKey) {
            text.value = text.value.slice(cursorPosition.value)
            cursorPosition.value = 0
            break
          }

        case 'k':
        case 'K':
          if (event.ctrlKey) {
            text.value = text.value.slice(0, cursorPosition.value)
            break
          }

        default:
          if (
            event.key.length === 1
            && !event.altKey
            && !event.ctrlKey
            && !event.metaKey
          ) {
            text.value
              = text.value.slice(0, cursorPosition.value)
              + evt.data
              + text.value.slice(cursorPosition.value)
            cursorPosition.value++
          }
          break
      }
    }
  }
})
</script>

<template borderStyle="round">
  <div>
    <div
      class="border-round min-h-10 min-w-30 p-1"
      :borderColor="disabled ? 'gray' : active ? 'transparent' : undefined"
      title="Input"
    >
      <SyntaxHighlight :code="displayedValue" lang="js" />
    </div>
  </div>
</template>
