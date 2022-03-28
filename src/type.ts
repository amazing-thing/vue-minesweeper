export interface BlockState {
  x: number
  y: number
  reversed?: boolean// 是否翻转
  mine?: boolean// 是否炸弹
  flagged?: boolean// 是否标注旗帜
  adjanceMine: number// 周围炸弹数量
  heightLine?: boolean// 是否高亮
}
