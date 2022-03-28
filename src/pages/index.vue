<script setup lang="ts">
import { Play, isDev, toggleDev } from '~/composables/index'

const play = new Play(9, 9, 10)
useStorage('vue-Minesweeper', play.state)

const now = $(useNow())
const time = computed(() => {
  if (!play.state.value.startTime)
    return 0

  return Math.round(((play.state.value.endTime || +now) - play.state.value.startTime) / 1000)
})

const state = computed(() => play.state.value.block)
const mine = computed(() => play.blocks.reduce((sum, b) => {
  if (!play.state.value.mineGenerator)
    return play.mines

  return sum + (b.mine ? 1 : 0) - (b.flagged ? 1 : 0)
}, 0),
)

function choiceDifficulty(difficulty: 'easy'|'medium'|'hard') {
  switch (difficulty) {
    case 'easy':
      play.reset(9, 9, 10)
      break
    case 'medium':
      play.reset(16, 16, 40)
      break
    case 'hard':
      play.reset(30, 16, 99)
      break
  }
}
</script>

<template>
  <div pt10>
    <div font-mono text-xl p4>
      Minesweeper
    </div>
    <div flex="~ gap-2" justify-center>
      <button btn @click="choiceDifficulty('easy')">
        简单
      </button>
      <button btn @click="choiceDifficulty('medium')">
        中等
      </button>
      <button btn @click="choiceDifficulty('hard')">
        困难
      </button>
    </div>
    <div pt4 flex="~ gap5" items-center justify-center text-2xl font-mono>
      <div flex="~" items-center justify-center>
        <div i-mdi-timer />
        {{ time }}
      </div>
      <div flex="~" items-center justify-center>
        <div i-mdi-mine />
        {{ mine }}
      </div>
    </div>
    <div p5 w-full overflow-auto>
      <div
        v-for="row, y in state" :key="y"
        flex="~" items-center justify-center
        w-max ma
      >
        <MineBlock
          v-for="item,x in row" :key="x"
          :item="item"
          :class="item.heightLine?'bg-gray-600/60':''"
          @click="play.onClick(item)"
          @dblclick="play.autoExpend(item)"
          @contextmenu.prevent="play.onRightClick(item)"
        />
      </div>
    </div>
    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev?'DEV':'NORMAL' }}
      </button>
      <!-- <button btn @click="play.reset">
        重置
      </button> -->
    </div>
  </div>

  <CanvasConfetti :passed="play.state.value.status==='won'" />
</template>
