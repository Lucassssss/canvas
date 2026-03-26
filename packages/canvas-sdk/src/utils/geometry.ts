import { Vec, Box } from '../primitives'

/**
 * 判断点是否在矩形内
 * @param point 要检测的点
 * @param rect 矩形边界框
 * @returns 点是否在矩形内
 */
export function isPointInRect(point: Vec, rect: Box): boolean {
  return rect.containsPoint(point)
}

/**
 * 判断点是否在旋转矩形内
 * @param point 要检测的点
 * @param centerX 旋转中心 X 坐标
 * @param centerY 旋转中心 Y 坐标
 * @param width 矩形宽度
 * @param height 矩形高度
 * @param rotation 旋转角度（弧度）
 * @returns 点是否在旋转矩形内
 */
export function isPointInRotatedRect(
  point: Vec,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  rotation: number
): boolean {
  const cos = Math.cos(-rotation)
  const sin = Math.sin(-rotation)

  const dx = point.x - centerX
  const dy = point.y - centerY

  const localX = dx * cos - dy * sin
  const localY = dx * sin + dy * cos

  const halfWidth = width / 2
  const halfHeight = height / 2

  return Math.abs(localX) <= halfWidth && Math.abs(localY) <= halfHeight
}

/**
 * 计算旋转后的边界框
 * @param x 矩形左上角 X 坐标
 * @param y 矩形左上角 Y 坐标
 * @param width 矩形宽度
 * @param height 矩形高度
 * @param rotation 旋转角度（弧度）
 * @returns 旋转后的轴对齐边界框
 */
export function getRotatedBoundingBox(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): Box {
  const cos = Math.abs(Math.cos(rotation))
  const sin = Math.abs(Math.sin(rotation))

  const newWidth = width * cos + height * sin
  const newHeight = width * sin + height * cos

  const centerX = x + width / 2
  const centerY = y + height / 2

  return new Box(
    centerX - newWidth / 2,
    centerY - newHeight / 2,
    newWidth,
    newHeight
  )
}

/**
 * 计算两点之间的距离
 * @param p1 第一个点
 * @param p2 第二个点
 * @returns 两点之间的欧几里得距离
 */
export function distance(p1: Vec, p2: Vec): number {
  return p1.distanceTo(p2)
}

/**
 * 计算角度（弧度）
 * @param from 起始点
 * @param to 目标点
 * @returns 从 from 到 to 的角度（弧度）
 */
export function angle(from: Vec, to: Vec): number {
  return from.angleTo(to)
}

/**
 * 限制值在范围内
 * @param value 要限制的值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的值
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * 线性插值
 * @param a 起始值
 * @param b 目标值
 * @param t 插值因子 [0, 1]
 * @returns 插值结果
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * 角度转弧度
 * @param degrees 角度值
 * @returns 弧度值
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * 弧度转角度
 * @param radians 弧度值
 * @returns 角度值
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * 规范化角度到 [0, 2π) 范围
 * @param angle 角度（弧度）
 * @returns 规范化后的角度
 */
export function normalizeAngle(angle: number): number {
  const TWO_PI = Math.PI * 2
  angle = angle % TWO_PI
  if (angle < 0) {
    angle += TWO_PI
  }
  return angle
}

/**
 * 计算点到线段的最短距离
 * @param point 点
 * @param lineStart 线段起点
 * @param lineEnd 线段终点
 * @returns 点到线段的最短距离
 */
export function pointToSegmentDistance(
  point: Vec,
  lineStart: Vec,
  lineEnd: Vec
): number {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const lengthSq = dx * dx + dy * dy

  if (lengthSq === 0) {
    return point.distanceTo(lineStart)
  }

  let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSq
  t = clamp(t, 0, 1)

  const closestX = lineStart.x + t * dx
  const closestY = lineStart.y + t * dy

  return Math.sqrt((point.x - closestX) ** 2 + (point.y - closestY) ** 2)
}

/**
 * 判断两个矩形是否相交
 * @param rect1 第一个矩形
 * @param rect2 第二个矩形
 * @returns 是否相交
 */
export function rectsIntersect(rect1: Box, rect2: Box): boolean {
  return rect1.intersects(rect2)
}

/**
 * 计算多个矩形的并集边界框
 * @param boxes 矩形数组
 * @returns 并集边界框
 */
export function unionBoxes(boxes: Box[]): Box {
  if (boxes.length === 0) {
    return new Box()
  }

  let result = boxes[0].clone()
  for (let i = 1; i < boxes.length; i++) {
    result = result.union(boxes[i])
  }
  return result
}
