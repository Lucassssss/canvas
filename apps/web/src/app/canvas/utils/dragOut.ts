import { TransformMatrix } from '@/lib/canvas/transform'
import { useCanvasStore } from '../store'
import { detectDropTarget } from './dropZone'
import { updateDropTarget, getDropTarget, clearDropTarget } from './dropTargetManager'
import { DIMENSIONS } from '../constants/dimensions'

export function startMatrixDrag(
  e: React.MouseEvent,
  imageUrl: string,
  sourceWidth: number = DIMENSIONS.IMAGE.width,
  sourceHeight: number = DIMENSIONS.IMAGE.height
) {
  const state = useCanvasStore.getState()
  const { zoom } = state.viewport
  
  // Create a temporary clone
  const clone = document.createElement('div')
  clone.style.position = 'fixed'
  clone.style.left = '0px'
  clone.style.top = '0px'
  clone.style.width = `${sourceWidth}px`
  clone.style.height = `${sourceHeight}px`
  clone.style.backgroundImage = `url("${imageUrl}")`
  clone.style.backgroundSize = 'contain'
  clone.style.backgroundRepeat = 'no-repeat'
  clone.style.backgroundPosition = 'center'
  clone.style.pointerEvents = 'none' // Crucial for elementsFromPoint
  clone.style.zIndex = '9999'
  clone.style.opacity = '0.8'
  clone.style.borderRadius = '8px'
  clone.style.border = '2px solid var(--canvas-primary, #3b82f6)'
  clone.style.backgroundColor = '#e5e7eb'
  clone.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
  clone.classList.add('dragging')
  
  const startX = e.clientX
  const startY = e.clientY
  
  let currentX = startX - (sourceWidth * zoom) / 2
  let currentY = startY - (sourceHeight * zoom) / 2
  
  clone.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${currentX}, ${currentY})`
  clone.style.transformOrigin = '0 0'
  
  const container = document.body
  container.appendChild(clone)
  
  const mouseMoveHandler = (moveEvent: MouseEvent) => {
    const dx = moveEvent.clientX - startX
    const dy = moveEvent.clientY - startY
    const newX = currentX + dx
    const newY = currentY + dy
    clone.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${newX}, ${newY})`
    
    // Check drop targets
    const currentState = useCanvasStore.getState()
    const target = detectDropTarget(moveEvent.clientX, moveEvent.clientY, currentState.shapes, [])
    updateDropTarget(target)
  }
  
  const mouseUpHandler = (upEvent: MouseEvent) => {
    window.removeEventListener('mousemove', mouseMoveHandler)
    window.removeEventListener('mouseup', mouseUpHandler)
    
    // Small delay to allow react cycles to catch up if needed
    setTimeout(() => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone)
      }
    }, 50)
    
    const currentState = useCanvasStore.getState()
    const dropTarget = getDropTarget()
    
    if (dropTarget) {
      // Drop into a slot
      const targetShape = currentState.shapes.find(s => s.id === dropTarget.combinationShapeId)
      if (targetShape) {
        if (targetShape.type === 'custom-combination') {
          const currentSlots = targetShape.customInputSlots || []
          const newSlots = currentSlots.map(s => 
            s.id === dropTarget.slotId ? { ...s, imageUrl } : s
          )
          currentState.updateShape(targetShape.id, { customInputSlots: newSlots })
        } else if (targetShape.type === 'ai-combination') {
          const currentSlots = targetShape.slotContents || {}
          currentState.updateShape(targetShape.id, {
            slotContents: {
              ...currentSlots,
              [dropTarget.slotId]: { ...currentSlots[dropTarget.slotId], imageUrl }
            }
          })
        }
      }
    } else {
      // Create new shape loosely dropped on canvas
      const canvasPt = currentState.screenToCanvas(upEvent.clientX, upEvent.clientY)
      // Center the drop position
      const finalCanvasX = canvasPt.x - sourceWidth / 2
      const finalCanvasY = canvasPt.y - sourceHeight / 2
      
      const newShapeId = `image-${Date.now()}`
      currentState.addShape({
        id: newShapeId,
        type: 'image',
        x: finalCanvasX,
        y: finalCanvasY,
        width: sourceWidth, // Keep standard proportions
        height: sourceHeight,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        imageUrl,
        imageName: '生成的组件副本',
        fill: '',
        stroke: '',
        strokeWidth: 0,
        opacity: 1
      })
      currentState.setSelectedIds([newShapeId])
    }
    
    clearDropTarget()
  }
  
  window.addEventListener('mousemove', mouseMoveHandler)
  window.addEventListener('mouseup', mouseUpHandler)
}
