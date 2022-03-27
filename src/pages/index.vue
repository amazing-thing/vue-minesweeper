<script setup lang="ts">
import { Play, isDev, toggleDev } from '~/composables/index'

const play = new Play(10, 10)
useStorage('vue-Minesweeper', play.state)
const state = computed(() => play.state.value.block)
</script>

<template>
  <div>
    Minesweeper
    <div p5>
      <div
        v-for="row, y in state" :key="y"
        flex="~" items-center justify-center
      >
        <MineBlock
          v-for="item,x in row" :key="x"
          :item="item"
          @click="play.onClick(item)"
          @contextmenu.prevent="play.onRightClick(item)"
        />
      </div>
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
</template>
