<script setup lang="ts">
import { Play, isDev, toggleDev } from '~/composables/index'

const play = new Play(10, 10)
const state = play.state
</script>

<template>
  Minesweeper
  <button btn @click="toggleDev()">
    {{ isDev }}
  </button>
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
</template>
