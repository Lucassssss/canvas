import type { ShapeProps } from '../shapes/types'

interface DropTarget {
  combinationShapeId: string
  slotId: string
}

const SLOT_DATA_ATTR = 'data-slot-id'
const COMBINATION_DATA_ATTR = 'data-combination-shape-id'

export function detectDropTarget(
  clientX: number,
  clientY: number,
  shapes: ShapeProps[],
  excludedShapeIds: string[]
): DropTarget | null {
  const excludedSet = new Set(excludedShapeIds)

  const combinationShapes = shapes.filter(
    (s) => s.type === 'custom-combination' && !excludedSet.has(s.id)
  )

  if (combinationShapes.length === 0) return null

  const elementsUnderPoint = document.elementsFromPoint(clientX, clientY)

  for (let i = 0; i < elementsUnderPoint.length; i++) {
    const el = elementsUnderPoint[i] as HTMLElement
    const slotId = el.getAttribute?.(SLOT_DATA_ATTR)
    if (!slotId) continue

    const combinationShapeId = el.getAttribute?.(COMBINATION_DATA_ATTR)
    if (!combinationShapeId) continue

    return { combinationShapeId, slotId }
  }

  return null
}
