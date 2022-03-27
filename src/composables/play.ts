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
  // state = ref() as Ref<BlockState[][]>
  // mineGenerator = false
  // gameState = ref<'play'|'won'|'lose'>('play')

  state = ref<playState>({
    mineGenerator: false,
    gameState: 'play',
    block: [],
  })

  constructor(public height: number, public width: number) {
    this.reset()
  }

  reset() {
    this.state.value = {
      mineGenerator: false,
      gameState: 'play',
      block: Array.from({ length: this.height }, (_, y) => (
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x, y, adjanceMine: 0, reversed: false,
        }))),
      ),
    }
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

  // 生成炸弹
  createMine(initialize: BlockState) {
    for (const row of this.state.value.block) {
      for (const block of row) {
        if (Math.abs(initialize.x - block.x) <= 1)
          continue
        if (Math.abs(initialize.y - block.y) <= 1)
          continue

        block.mine = Math.random() < 0.2
      }
    }

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
    const blocks = this.state.value.block.flat()
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

    const blocks = this.state.value.block.flat()

    if (blocks.every(b => b.reversed || b.flagged)) {
      if (blocks.some(b => b.flagged && !b.mine))
        this.state.value.gameState = 'lose'
      else
        this.state.value.gameState = 'won'
    }
  }
}
