import React, { useEffect } from 'react'
import { useCanvasStore } from '../store'
import { ShapeProps, ClothingView } from '../shapes/types'

const SVG_VIEWBOX: Record<ClothingView, { width: number; height: number }> = {
  front: { width: 2048, height: 2048 },
  back: { width: 2048, height: 2048 },
  side: { width: 2048, height: 2048 },
}

interface LogoEditorLayerProps {
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: { x: number; y: number; zoom: number }
}

export const LogoEditorLayer: React.FC<LogoEditorLayerProps> = ({
  shapes,
  selectedIds,
  viewport,
}) => {
  const { updateShape, exitLogoEditing, logoEditingState } = useCanvasStore()

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id) && s.activeLogoId
  )

  const isEditing = logoEditingState.isEditing && selectedClothing?.activeLogoId

  useEffect(() => {
    if (!isEditing || !selectedClothing) {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, selectedClothing])

  if (!isEditing || !selectedClothing) {
    return null
  }

  const clothing = selectedClothing
  const view = (clothing.clothingView || 'front') as ClothingView
  const viewBox = SVG_VIEWBOX[view]

  const scaleX = clothing.width / viewBox.width
  const scaleY = clothing.height / viewBox.height
  const scale = Math.min(scaleX, scaleY)

  const svgOffsetX = (clothing.width - viewBox.width * scale) / 2
  const svgOffsetY = (clothing.height - viewBox.height * scale) / 2

  const canvasToScreen = (canvasX: number, canvasY: number) => {
    return {
      x: canvasX * viewport.zoom + viewport.x,
      y: canvasY * viewport.zoom + viewport.y,
    }
  }

  const logoRect = clothing.logoAreas?.find((l) => l.id === selectedClothing.activeLogoId)
  if (!logoRect) return null

  const logoCanvasX = clothing.x + svgOffsetX + logoRect.x * scale
  const logoCanvasY = clothing.y + svgOffsetY + logoRect.y * scale
  const logoCanvasWidth = logoRect.width * scale
  const logoCanvasHeight = logoRect.height * scale

  const topLeft = canvasToScreen(logoCanvasX, logoCanvasY)
  const bottomRight = canvasToScreen(
    logoCanvasX + logoCanvasWidth,
    logoCanvasY + logoCanvasHeight
  )

  const borderStyle: React.CSSProperties = {
    position: 'fixed',
    left: topLeft.x,
    top: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
    border: '1px dashed #F59E0B',
    boxSizing: 'border-box',
    pointerEvents: 'none',
    zIndex: 9998,
  }

  const notificationStyle: React.CSSProperties = {
    position: 'fixed',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    padding: '10px 20px',
    borderRadius: 9999,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    fontSize: 14,
    color: '#374151',
  }

  const handleClose = () => {
    updateShape(selectedClothing.id, { activeLogoId: undefined })
    exitLogoEditing()
  }

  return (
    <>
      <div style={borderStyle} />
      <div style={notificationStyle}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            animation: 'pulse 1.5s infinite',
          }}
        />
        <span style={{ fontWeight: 500 }}>正在编辑 LOGO 区域</span>
        <span style={{ color: '#9CA3AF' }}>|</span>
        <span style={{ color: '#6B7280' }}>
          {logoRect.id.replace('logo_', '').toUpperCase()}
        </span>
        <button
          onClick={handleClose}
          style={{
            marginLeft: 8,
            padding: '4px 12px',
            backgroundColor: '#F3F4F6',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          退出编辑 (ESC)
        </button>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}