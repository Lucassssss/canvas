import React, { useState, useEffect, useCallback } from 'react'
import { Minus, Plus, Maximize } from 'lucide-react'
import { useCanvasStore } from '../store'

export const ZoomControls: React.FC = () => {
  const { viewport, setViewport, zoomToFit } = useCanvasStore()
  const [showDropdown, setShowDropdown] = useState(false)

  const zoomIn = useCallback(() => {
    const newZoom = Math.min(viewport.zoom * 1.2, 5)
    setViewport({ zoom: newZoom })
  }, [viewport.zoom, setViewport])

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(viewport.zoom / 1.2, 0.1)
    setViewport({ zoom: newZoom })
  }, [viewport.zoom, setViewport])

  const resetZoom = useCallback(() => {
    setViewport({ zoom: 1 })
  }, [setViewport])

  const handleFitToScreen = useCallback(() => {
    zoomToFit()
    setShowDropdown(false)
  }, [zoomToFit])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? e.metaKey : e.ctrlKey

      if (cmdKey && e.key === '=') {
        e.preventDefault()
        zoomIn()
        return
      }

      if (cmdKey && e.key === '-') {
        e.preventDefault()
        zoomOut()
        return
      }

      if (cmdKey && e.key === '0') {
        e.preventDefault()
        handleFitToScreen()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomIn, zoomOut, handleFitToScreen])

  return (
    <div className="zoom-controls">
      <button
        className="zoom-btn"
        onClick={zoomOut}
        disabled={viewport.zoom <= 0.1}
        title="缩小 (Cmd/Ctrl + -)"
      >
        <Minus size={16} />
      </button>

      <div
        className="zoom-value relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {Math.round(viewport.zoom * 100)}%

        {showDropdown && (
          <div className="zoom-dropdown">
            <button onClick={handleFitToScreen}>
              适合屏幕
            </button>
            <button onClick={() => { resetZoom(); setShowDropdown(false); }}>
              100%
            </button>
            <button onClick={() => { setViewport({ zoom: 0.5 }); setShowDropdown(false); }}>
              50%
            </button>
            <button onClick={() => { setViewport({ zoom: 2 }); setShowDropdown(false); }}>
              200%
            </button>
          </div>
        )}
      </div>

      <button
        className="zoom-btn"
        onClick={zoomIn}
        disabled={viewport.zoom >= 5}
        title="放大 (Cmd/Ctrl + =)"
      >
        <Plus size={16} />
      </button>

      <button
        className="zoom-btn"
        onClick={handleFitToScreen}
        title="适合屏幕 (Cmd/Ctrl + 0)"
      >
        <Maximize size={16} />
      </button>
    </div>
  )
}
