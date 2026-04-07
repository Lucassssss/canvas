import { ShapeProps, AlignmentGuide } from '../shapes/types'

const ALIGNMENT_THRESHOLD = 5

interface ElementBounds {
  id: string
  left: number
  right: number
  top: number
  bottom: number
  centerX: number
  centerY: number
}

function getElementBounds(shape: ShapeProps): ElementBounds {
  return {
    id: shape.id,
    left: shape.x,
    right: shape.x + shape.width,
    top: shape.y,
    bottom: shape.y + shape.height,
    centerX: shape.x + shape.width / 2,
    centerY: shape.y + shape.height / 2,
  }
}

export function calculateAlignmentGuides(
  draggedShapes: ShapeProps[],
  allShapes: ShapeProps[],
  excludedIds: string[]
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = []
  const excludedSet = new Set(excludedIds)

  const otherShapes = allShapes.filter((s) => !excludedSet.has(s.id))
  if (otherShapes.length === 0) return guides

  const draggedBounds = draggedShapes.map(getElementBounds)
  const otherBounds = otherShapes.map(getElementBounds)

  const verticalPositions: Array<{ position: number; targetPosition: number; start: number; end: number }> = []
  const horizontalPositions: Array<{ position: number; targetPosition: number; start: number; end: number }> = []

  for (const dragged of draggedBounds) {
    for (const other of otherBounds) {
      if (Math.abs(dragged.left - other.left) < ALIGNMENT_THRESHOLD) {
        verticalPositions.push({
          position: dragged.left,
          targetPosition: other.left,
          start: Math.min(dragged.top, other.top),
          end: Math.max(dragged.bottom, other.bottom),
        })
      }

      if (Math.abs(dragged.left - other.right) < ALIGNMENT_THRESHOLD) {
        verticalPositions.push({
          position: dragged.left,
          targetPosition: other.right,
          start: Math.min(dragged.top, other.top),
          end: Math.max(dragged.bottom, other.bottom),
        })
      }

      if (Math.abs(dragged.right - other.right) < ALIGNMENT_THRESHOLD) {
        verticalPositions.push({
          position: dragged.right,
          targetPosition: other.right,
          start: Math.min(dragged.top, other.top),
          end: Math.max(dragged.bottom, other.bottom),
        })
      }

      if (Math.abs(dragged.right - other.left) < ALIGNMENT_THRESHOLD) {
        verticalPositions.push({
          position: dragged.right,
          targetPosition: other.left,
          start: Math.min(dragged.top, other.top),
          end: Math.max(dragged.bottom, other.bottom),
        })
      }

      if (Math.abs(dragged.centerX - other.centerX) < ALIGNMENT_THRESHOLD) {
        verticalPositions.push({
          position: dragged.centerX,
          targetPosition: other.centerX,
          start: Math.min(dragged.top, other.top),
          end: Math.max(dragged.bottom, other.bottom),
        })
      }

      if (Math.abs(dragged.top - other.top) < ALIGNMENT_THRESHOLD) {
        horizontalPositions.push({
          position: dragged.top,
          targetPosition: other.top,
          start: Math.min(dragged.left, other.left),
          end: Math.max(dragged.right, other.right),
        })
      }

      if (Math.abs(dragged.top - other.bottom) < ALIGNMENT_THRESHOLD) {
        horizontalPositions.push({
          position: dragged.top,
          targetPosition: other.bottom,
          start: Math.min(dragged.left, other.left),
          end: Math.max(dragged.right, other.right),
        })
      }

      if (Math.abs(dragged.bottom - other.bottom) < ALIGNMENT_THRESHOLD) {
        horizontalPositions.push({
          position: dragged.bottom,
          targetPosition: other.bottom,
          start: Math.min(dragged.left, other.left),
          end: Math.max(dragged.right, other.right),
        })
      }

      if (Math.abs(dragged.bottom - other.top) < ALIGNMENT_THRESHOLD) {
        horizontalPositions.push({
          position: dragged.bottom,
          targetPosition: other.top,
          start: Math.min(dragged.left, other.left),
          end: Math.max(dragged.right, other.right),
        })
      }

      if (Math.abs(dragged.centerY - other.centerY) < ALIGNMENT_THRESHOLD) {
        horizontalPositions.push({
          position: dragged.centerY,
          targetPosition: other.centerY,
          start: Math.min(dragged.left, other.left),
          end: Math.max(dragged.right, other.right),
        })
      }
    }
  }

  const uniqueVertical = mergeAndDeduplicatePositions(verticalPositions)
  const uniqueHorizontal = mergeAndDeduplicatePositions(horizontalPositions)

  for (const pos of uniqueVertical) {
    guides.push({
      type: 'vertical',
      position: pos.position,
      targetPosition: pos.targetPosition,
      start: pos.start,
      end: pos.end,
    })
  }

  for (const pos of uniqueHorizontal) {
    guides.push({
      type: 'horizontal',
      position: pos.position,
      targetPosition: pos.targetPosition,
      start: pos.start,
      end: pos.end,
    })
  }

  return guides
}

function mergeAndDeduplicatePositions(
  positions: Array<{ position: number; targetPosition: number; start: number; end: number }>
): Array<{ position: number; targetPosition: number; start: number; end: number }> {
  if (positions.length === 0) return []

  const positionMap = new Map<number, { targetPosition: number; start: number; end: number }>()

  for (const pos of positions) {
    const roundedPos = Math.round(pos.position * 100) / 100
    const existing = positionMap.get(roundedPos)

    if (existing) {
      positionMap.set(roundedPos, {
        targetPosition: pos.targetPosition,
        start: Math.min(existing.start, pos.start),
        end: Math.max(existing.end, pos.end),
      })
    } else {
      positionMap.set(roundedPos, { targetPosition: pos.targetPosition, start: pos.start, end: pos.end })
    }
  }

  return Array.from(positionMap.entries()).map(([position, range]) => ({
    position,
    targetPosition: range.targetPosition,
    start: range.start,
    end: range.end,
  }))
}

export function snapToAlignment(
  draggedShape: ShapeProps,
  guides: AlignmentGuide[]
): { x: number; y: number } | null {
  if (guides.length === 0) return null

  let snappedX: number | null = null
  let snappedY: number | null = null

  const draggedBounds = getElementBounds(draggedShape)

  for (const guide of guides) {
    if (guide.type === 'vertical' && snappedX === null) {
      const leftDiff = Math.abs(draggedBounds.left - guide.position)
      const rightDiff = Math.abs(draggedBounds.right - guide.position)
      const centerDiff = Math.abs(draggedBounds.centerX - guide.position)

      if (leftDiff < ALIGNMENT_THRESHOLD) {
        snappedX = guide.targetPosition
      } else if (rightDiff < ALIGNMENT_THRESHOLD) {
        snappedX = guide.targetPosition - draggedShape.width
      } else if (centerDiff < ALIGNMENT_THRESHOLD) {
        snappedX = guide.targetPosition - draggedShape.width / 2
      }
    } else if (guide.type === 'horizontal' && snappedY === null) {
      const topDiff = Math.abs(draggedBounds.top - guide.position)
      const bottomDiff = Math.abs(draggedBounds.bottom - guide.position)
      const centerDiff = Math.abs(draggedBounds.centerY - guide.position)

      if (topDiff < ALIGNMENT_THRESHOLD) {
        snappedY = guide.targetPosition
      } else if (bottomDiff < ALIGNMENT_THRESHOLD) {
        snappedY = guide.targetPosition - draggedShape.height
      } else if (centerDiff < ALIGNMENT_THRESHOLD) {
        snappedY = guide.targetPosition - draggedShape.height / 2
      }
    }
  }

  if (snappedX !== null || snappedY !== null) {
    return {
      x: snappedX ?? draggedShape.x,
      y: snappedY ?? draggedShape.y,
    }
  }

  return null
}
