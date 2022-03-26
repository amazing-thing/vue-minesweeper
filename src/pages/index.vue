<script setup lang="ts">

const HEIGHT = 10
const WIDTH = 10

interface blockState {
  x: number
  y: number
  reversed: boolean// 是否翻转
  mine?: boolean// 是否炸弹
  flagged?: boolean// 是否标注旗帜
  adjanceMine: number// 周围炸弹数量
}

const position = [
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [0, 1],
  [0, -1],
  [-1, -1],
  [-1, 1],
]

const numberClass = [
  'text-transparent',
  'text-blue',
  'text-grenn',
  'text-yellow',
  'text-orange',
  'text-teal',
  'text-blue',
  'text-',
]

// 数字颜色
function getNumberClass(block: blockState) {
  if (!block.reversed)
    return 'bg-gray-500/10'

  return numberClass[block.adjanceMine]
}

const state = reactive(Array.from({ length: HEIGHT }, (_, y) => (
  Array.from({ length: WIDTH }, (_, x): blockState => ({
    x, y, adjanceMine: 0, reversed: false,
  }))),
))

// 生成炸弹
function createMine() {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.2
  }
}

// 生成数字
function createNumber() {
  for (const row of state) {
    for (const block of row) {
      position.forEach((p) => {
        const x2 = p[0] + block.x
        const y2 = p[1] + block.y
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
          return
        if (state[y2][x2].mine)
          block.adjanceMine += 1
      })
    }
  }
}

function onClick(block: blockState) {
  block.reversed = true
}

createMine()
createNumber()

</script>

<template>
  Minesweeper
  <div p5>
    <div
      v-for="row, y in state" :key="y"
      flex="~" items-center justify-center
    >
      <button
        v-for="item,x in row" :key="x"
        flex="~" items-center justify-center
        w10 h10
        border="1 gray-400/10"
        m=".5"
        hover="bg-gray/10"
        :class="getNumberClass(item)"
        @click="onClick(item)"
      >
        <template v-if="item.reversed">
          <div v-if="item.mine" class="i-mdi-mine" bg-red-500 />
          <div v-else>
            {{ item.adjanceMine }}
          </div>
        </template>
      </button>
    </div>
  </div>
</template>
