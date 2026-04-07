interface DropTargetData {
  combinationShapeId: string
  slotId: string
}

let currentDropTarget: DropTargetData | null = null

export function getDropTarget(): DropTargetData | null {
  return currentDropTarget
}

export function updateDropTarget(target: DropTargetData | null): void {
  const previousTarget = currentDropTarget
  currentDropTarget = target

  if (previousTarget) {
    const prevEl = document.querySelector(
      `[data-combination-shape-id="${previousTarget.combinationShapeId}"][data-slot-id="${previousTarget.slotId}"]`
    )
    if (prevEl) {
      prevEl.classList.remove('drop-target-active')
    }
  }

  if (target) {
    const newEl = document.querySelector(
      `[data-combination-shape-id="${target.combinationShapeId}"][data-slot-id="${target.slotId}"]`
    )
    if (newEl) {
      newEl.classList.add('drop-target-active')
    }
  }
}

export function clearDropTarget(): void {
  updateDropTarget(null)
}
