import { ShapeProps } from '@/app/canvas/shapes/types'

export function getRotatedBoundingBox(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): { minX: number; minY: number; maxX: number; maxY: number } {
  if (rotation === 0 || !rotation) {
    return { minX: x, minY: y, maxX: x + width, maxY: y + height }
  }

  const cx = x + width / 2
  const cy = y + height / 2
  const rad = (rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const corners = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ]

  const rotatedCorners = corners.map((corner) => {
    const dx = corner.x - cx
    const dy = corner.y - cy
    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    }
  })

  const xs = rotatedCorners.map((c) => c.x)
  const ys = rotatedCorners.map((c) => c.y)

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  }
}

export function getShapesBoundingBox(shapes: ShapeProps[]) {
  if (shapes.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
  
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  shapes.forEach(shape => {
    const bounds = getRotatedBoundingBox(shape.x, shape.y, shape.width, shape.height, shape.rotation || 0)
    if (bounds.minX < minX) minX = bounds.minX
    if (bounds.minY < minY) minY = bounds.minY
    if (bounds.maxX > maxX) maxX = bounds.maxX
    if (bounds.maxY > maxY) maxY = bounds.maxY
  })

  return { minX, minY, maxX, maxY }
}
