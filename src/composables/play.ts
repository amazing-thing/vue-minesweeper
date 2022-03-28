import type { Ref } from 'vue'
import type { BlockState } from '~/type'

interface playState{
  mineGenerator: boolean
  gameState: 'play'|'won'|'lose'
  block: BlockState[][]
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

export class Play {
  state = ref() as Ref<playState>

  constructor(
    public height: number,
    public width: number,
    public mines: number,
  ) {
    this.reset()
  }

  reset() {
    this.state.value = {
      mineGenerator: false,
      gameState: 'play',
      block: Array.from({ length: this.height }, (_, y) => (
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x,
          y,
          adjanceMine: 0,
          reversed: false,
        }))),
      ),
    }
  }

  get blocks() {
    return this.state.value.block.flat()
  }

  // 右键
  onRightClick(block: BlockState) {
    if (this.state.value.gameState !== 'play')
      return

    if (block.reversed)
      return

    block.flagged = !block.flagged
    this.checkGameState()
  }

  // min-max之间随机数
  random(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  intRandom(min: number, max: number) {
    return Math.round(this.random(min, max))
  }

  // 生成炸弹
  createMine(initialize: BlockState) {
    const updateMine = () => {
      const x = this.intRandom(0, this.width - 1)
      const y = this.intRandom(0, this.height - 1)

      const block = this.state.value.block[y][x]

      if (Math.abs(initialize.x - block.x) <= 1)
        return false
      if (Math.abs(initialize.y - block.y) <= 1)
        return false

      if (block.mine)
        return false
      block.mine = true
      return true
    }

    Array.from({ length: this.mines }, () => null).forEach(() => {
      let place = false
      while (!place)
        place = updateMine()
    })

    this.createNumber()
  }

  // 生成数字
  createNumber() {
    this.state.value.block.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return
        this.generator(block).forEach((b) => {
          if (b.mine)
            block.adjanceMine++
        })
      })
    })
  }

  // 重用
  generator(block: BlockState) {
    return position.map(([dx, dy]) => {
      const x2 = dx + block.x
      const y2 = dy + block.y
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.state.value.block[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  // 展开0
  expendeZero(initialize: BlockState) {
    if (initialize.adjanceMine)
      return

    this.generator(initialize).forEach((b) => {
      if (!b.reversed) {
        b.reversed = true
        this.expendeZero(b)
      }
    })
  }

  // 展开所有炸弹
  showAllMine() {
    const blocks = this.blocks
    blocks.forEach((b) => {
      if (b.mine)
        b.reversed = true
    })
  }

  // 点击
  onClick(block: BlockState) {
    if (this.state.value.gameState !== 'play')
      return

    if (!this.state.value.mineGenerator) {
      this.createMine(block)
      this.state.value.mineGenerator = true
    }

    if (block.flagged)
      return

    block.reversed = true

    if (block.mine) {
      this.state.value.gameState = 'lose'
      this.showAllMine()
    }

    this.expendeZero(block)
    this.checkGameState()
  }

  // 检查胜利
  checkGameState() {
    if (!this.state.value.mineGenerator)
      return

    const blocks = this.blocks

    if (blocks.every(b => b.reversed || b.flagged)) {
      if (blocks.some(b => b.flagged && !b.mine))
        this.state.value.gameState = 'lose'
      else
        this.state.value.gameState = 'won'
    }
  }
}
