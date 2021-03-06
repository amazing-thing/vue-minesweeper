import type { Ref } from 'vue'
import type { BlockState } from '~/type'

type GameState='play'|'won'|'lose'

interface playState{
  mineGenerator: boolean
  status: GameState
  block: BlockState[][]
  startTime?: number
  endTime?: number
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
  timer = ref<number>()

  constructor(
    public height: number,
    public width: number,
    public mines: number,
  ) {
    this.reset()
  }

  reset(height = this.height,
    width = this.width,
    mines = this.mines) {
    this.height = height
    this.width = width
    this.mines = mines
    clearTimeout(this.timer.value)

    this.state.value = {
      // startTime: +Date.now(),
      mineGenerator: false,
      status: 'play',
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
    if (this.state.value.status !== 'play')
      return

    if (block.reversed)
      return

    block.flagged = !block.flagged
    this.checkstatus()
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

      if (Math.abs(initialize.x - block.x) <= 1 && Math.abs(initialize.y - block.y) <= 1)
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
      if (b.mine) {
        b.flagged = false
        b.reversed = true
      }
    })
  }

  // 点击
  onClick(block: BlockState) {
    if (this.state.value.status !== 'play')
      return

    if (!this.state.value.mineGenerator) {
      this.state.value.startTime = +Date.now()
      this.createMine(block)
      this.state.value.mineGenerator = true
    }

    if (block.flagged)
      return

    block.reversed = true

    if (block.mine)
      this.gameOver('lose')

    this.expendeZero(block)
    this.checkstatus()
  }

  // 检查胜利
  checkstatus() {
    if (!this.state.value.mineGenerator)
      return

    const blocks = this.blocks

    if (blocks.every(b => b.reversed || b.flagged || b.mine)) {
      if (blocks.some(b => b.flagged && !b.mine))
        this.gameOver('lose')
      else
        this.gameOver('won')
    }
  }

  // 双击
  autoExpend(block: BlockState, isPhone?: boolean) {
    if (this.state.value.status !== 'play')
      return

    if (block.flagged)
      return

    const s = this.generator(block)
    const count = s.reduce((a, b) => a + (b.flagged ? 1 : 0), 0)
    if (count === block.adjanceMine) {
      s.forEach((i) => {
        if (i.mine !== i.flagged)
          this.gameOver('lose')

        if (!i.flagged)
          i.reversed = true

        if (i.adjanceMine === 0 && !i.mine)
          this.expendeZero(i)
      })
    }
    else {
      s.forEach((i) => {
        if (!i.reversed && !i.flagged) {
          i.heightLine = true
          this.timer.value = window.setTimeout(() => {
            i.heightLine = false
          }, 100)
        }
      })
    }

    if (isPhone) {
      const mine = s.reduce((a, b) => a + (b.mine ? 1 : 0), 0)
      const revers = s.reduce((a, b) => a + (!b.reversed ? 1 : 0), 0)
      if (mine === block.adjanceMine && revers === block.adjanceMine) {
        s.forEach((i) => {
          if (!i.reversed && i.mine)
            i.flagged = true
        })
      }
    }
    this.checkstatus()
  }

  gameOver(status: GameState) {
    this.state.value.status = status
    this.state.value.endTime = +Date.now()

    if (status === 'lose')
      this.showAllMine()
  }
}
