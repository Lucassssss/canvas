'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useCanvasStore } from '../store'
import { ShapeProps, ClothingView, ClothingColors } from './types'

const SVG_BASE_URL = '/clothing/'

const CLOTHING_SVGS: Record<ClothingView, string> = {
  front: '前幅.svg',
  back: '后幅.svg',
  side: '侧幅.svg',
}

const DEFAULT_COLORS: ClothingColors = {
  body: '#191919',
  sleeveLeft: '#8C8C8E',
  sleeveRight: '#8C8C8E',
  collar: '#8C8C8E',
}

const SVG_VIEWBOX: Record<ClothingView, { width: number; height: number }> = {
  front: { width: 2048, height: 2048 },
  back: { width: 2048, height: 2048 },
  side: { width: 2048, height: 2048 },
}

interface ClothingComponentProps {
  shape: ShapeProps
}

interface ParsedLogoArea {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export const ClothingComponent: React.FC<ClothingComponentProps> = ({ shape }) => {
  const [svgContent, setSvgContent] = useState<string>('')
  const [parsedLogoAreas, setParsedLogoAreas] = useState<ParsedLogoArea[]>([])

  const { updateShape, selectedIds, zoomToArea } = useCanvasStore()

  const view = shape.clothingView || 'front'
  const colors = shape.clothingColors || DEFAULT_COLORS
  const activeLogoId = shape.activeLogoId

  const isSelected = selectedIds.includes(shape.id)

  const viewBox = SVG_VIEWBOX[view]
  const scaleX = shape.width / viewBox.width
  const scaleY = shape.height / viewBox.height
  const scale = Math.min(scaleX, scaleY)

  const svgOffsetX = (shape.width - viewBox.width * scale) / 2
  const svgOffsetY = (shape.height - viewBox.height * scale) / 2

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch(`${SVG_BASE_URL}${CLOTHING_SVGS[view]}`)
        const text = await response.text()

        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'image/svg+xml')
        const svgEl = doc.querySelector('svg')

        if (!svgEl) return

        svgEl.removeAttribute('xmlns')
        svgEl.removeAttribute('xmlns:xlink')
        svgEl.removeAttribute('style')

        const paths = svgEl.querySelectorAll('path')
        paths.forEach((path) => {
          const id = path.getAttribute('id')
          let fillColor = ''

          if (id === 'fill_body') {
            fillColor = colors.body
          } else if (id === 'fill_sleeve_left') {
            fillColor = colors.sleeveLeft
          } else if (id === 'fill_sleeve_right') {
            fillColor = colors.sleeveRight
          } else if (id === 'fill_collar') {
            fillColor = colors.collar
          }

          if (fillColor) {
            path.style.fill = fillColor
          }
        })

        const logoRects = svgEl.querySelectorAll('rect[id^="logo"]')
        const logos: ParsedLogoArea[] = []
        logoRects.forEach((rect) => {
          const id = rect.getAttribute('id')
          if (id && id.startsWith('logo')) {
            logos.push({
              id,
              x: parseFloat(rect.getAttribute('x') || '0'),
              y: parseFloat(rect.getAttribute('y') || '0'),
              width: parseFloat(rect.getAttribute('width') || '0'),
              height: parseFloat(rect.getAttribute('height') || '0'),
            })
          }
        })
        setParsedLogoAreas(logos)
        updateShape(shape.id, { logoAreas: logos })

        const tempDiv = document.createElement('div')
        tempDiv.appendChild(svgEl)
        setSvgContent(tempDiv.innerHTML)
      } catch (error) {
        console.error('Failed to load clothing SVG:', error)
      }
    }

    loadSVG()
  }, [view, colors, shape.id])

  const handleLogoAreaClick = useCallback((e: React.MouseEvent, logoArea: ParsedLogoArea) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    const logoCanvasX = shape.x + svgOffsetX + logoArea.x * scale
    const logoCanvasY = shape.y + svgOffsetY + logoArea.y * scale
    const logoCanvasWidth = logoArea.width * scale
    const logoCanvasHeight = logoArea.height * scale

    updateShape(shape.id, { activeLogoId: logoArea.id })
    zoomToArea(logoCanvasX, logoCanvasY, logoCanvasWidth, logoCanvasHeight)
  }, [shape.id, shape.x, shape.y, svgOffsetX, svgOffsetY, scale, updateShape, zoomToArea])

  return (
    <div
      className="absolute inset-0 overflow-visible"
      style={{
        transform: `rotate(${shape.rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          left: svgOffsetX,
          top: svgOffsetY,
          width: viewBox.width * scale,
          height: viewBox.height * scale,
        }}
      >
        <div
          className="absolute origin-top-left"
          style={{
            transform: `scale(${scale})`,
            width: viewBox.width,
            height: viewBox.height,
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {parsedLogoAreas.map((logoArea) => {
        const logoImage = shape.logoContent?.[logoArea.id]
        const showOverlay = isSelected && !activeLogoId
        const showImage = !!logoImage

        return (
          <div
            key={logoArea.id}
            className="absolute cursor-pointer transition-all duration-200 z-10"
            style={{
              left: svgOffsetX + logoArea.x * scale,
              top: svgOffsetY + logoArea.y * scale,
              width: logoArea.width * scale,
              height: logoArea.height * scale,
              border: showOverlay && !logoImage ? '1px solid #3B82F6' : 'none',
              backgroundColor: logoImage ? 'transparent' : showOverlay ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
            onClick={showOverlay ? (e) => handleLogoAreaClick(e, logoArea) : undefined}
          >
            {showImage && (
              <img
                src={logoImage}
                alt=""
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'contain' }}
              />
            )}
            {showOverlay && !logoImage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[9px] text-blue-600 font-bold bg-white/95 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                  {logoArea.id.replace('logo_', '').toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { DEFAULT_COLORS }