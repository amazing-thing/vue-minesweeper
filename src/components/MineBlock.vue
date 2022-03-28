<script setup lang='ts'>
import type { BlockState } from '~/type'
import { isDev } from '~/composables/index'

defineProps<{ item: BlockState }>()

const numberClass = [
  'text-transparent',
  'text-blue',
  'text-green',
  'text-yellow',
  'text-orange',
  'text-teal',
  'text-blue',
]

// 数字颜色
function getNumberClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'

  if (!block.reversed)
    return 'bg-gray-500/10 hover:bg-gray/20'

  return numberClass[block.adjanceMine]
}

</script>

<template>
  <button
    flex="~" items-center justify-center
    min-w10 min-h10
    border="1 gray-400/10"

    :class="getNumberClass(item)"
  >
    <template v-if="item.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="item.reversed || isDev">
      <div v-if="item.mine" class="i-mdi-mine" bg-red-500 />
      <div v-else font-bold>
        {{ item.adjanceMine }}
      </div>
    </template>
  </button>
</template>

<style scoped>
</style>
