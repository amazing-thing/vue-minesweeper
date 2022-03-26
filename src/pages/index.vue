<script setup lang="ts">

const HEIGHT = 10
const WIDTH = 10

interface BlockState {
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
function getNumberClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'

  if (!block.reversed)
    return 'bg-gray-500/10 hover:bg-gray/20'

  return numberClass[block.adjanceMine]
}

const state = reactive(Array.from({ length: HEIGHT }, (_, y) => (
  Array.from({ length: WIDTH }, (_, x): BlockState => ({
    x, y, adjanceMine: 0, reversed: false,
  }))),
))

// 右键
function onRightClick(block: BlockState) {
  if (block.reversed)
    return
  block.flagged = !block.flagged
}

// 生成炸弹
function createMine(initialize: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initialize.x - block.x) <= 1)
        continue
      if (Math.abs(initialize.y - block.y) <= 1)
        continue

      block.mine = Math.random() < 0.2
    }
  }

  createNumber()
}

// 生成数字
function createNumber() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine)
        return
      generator(block).forEach((b) => {
        if (b.mine)
          block.adjanceMine++
      })
    })
  })
}

// 重用
function generator(block: BlockState) {
  return position.map(([dx, dy]) => {
    const x2 = dx + block.x
    const y2 = dy + block.y
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined

    return state[y2][x2]
  }).filter(Boolean) as BlockState[]
}

// 展开0
function expendeZero(initialize: BlockState) {
  if (initialize.adjanceMine)
    return

  generator(initialize).forEach((b) => {
    if (!b.reversed) {
      b.reversed = true
      expendeZero(b)
    }
  })
}

let mineGenerator = false

// 点击
function onClick(block: BlockState) {
  if (!mineGenerator) {
    createMine(block)
    mineGenerator = true
  }

  if (block.flagged)
    return

  if (block.mine)
    alert('you lose')

  block.reversed = true
  expendeZero(block)
}

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
        m=".2"
        :class="getNumberClass(item)"
        @click="onClick(item)"
        @contextmenu.prevent="onRightClick(item)"
      >
        <template v-if="item.flagged">
          <div i-mdi-flag text-red />
        </template>
        <template v-else-if="item.reversed">
          <div v-if="item.mine" class="i-mdi-mine" bg-red-500 />
          <div v-else>
            {{ item.adjanceMine }}
          </div>
        </template>
      </button>
    </div>
  </div>
</template>
