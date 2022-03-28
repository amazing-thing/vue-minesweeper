<script setup lang="ts">
import { Play, isDev, toggleDev } from '~/composables/index'

const play = new Play(10, 10, 10)
useStorage('vue-Minesweeper', play.state)
const state = computed(() => play.state.value.block)
const mine = computed(() => play.blocks.reduce((sum, b) => sum + (b.mine ? 1 : 0), 0))
</script>

<template>
  <div>
    Minesweeper
    <div p5 w-full overflow-auto>
      <div
        v-for="row, y in state" :key="y"
        flex="~" items-center justify-center
        w-max ma
      >
        <MineBlock
          v-for="item,x in row" :key="x"
          :item="item"
          @click="play.onClick(item)"
          @contextmenu.prevent="play.onRightClick(item)"
        />
      </div>
    </div>
    <div pb5>
      Mine Count:{{ mine }}
    </div>
    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev?'DEV':'NORMAL' }}
      </button>
      <button btn @click="play.reset">
        重置
      </button>
    </div>
  </div>

  <CanvasConfetti :passed="play.state.value.gameState==='won'" />
</template>
