import React from 'react'
import { ShapeUtil } from '@gke/canvas-sdk'

export type ToolType = 'select' | 'hand' | 'pen' | 'eraser' | 'rectangle' | 'ellipse' | 'text' | 'note' | 'image' | 'shape' | 'arrow' | 'clothing'

export type ClothingView = 'front' | 'back' | 'side'

export interface ClothingColors {
  body: string
  sleeveLeft: string
  sleeveRight: string
  collar: string
}

export interface LogoArea {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface ClothingShapeProps {
  id: string
  type: 'clothing'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  clothingView: ClothingView
  clothingColors: ClothingColors
  activeLogoId?: string
  logoAreas?: LogoArea[]
  logoContent?: Record<string, string>
  locked?: boolean
  meta?: Record<string, unknown>
}

const SVG_BASE_URL = '/clothing/'

const CLOTHING_SVGS: Record<ClothingView, string> = {
  front: '前幅.svg',
  back: '后幅.svg',
  side: '侧幅.svg',
}

const SVG_VIEWBOX: Record<ClothingView, { width: number; height: number }> = {
  front: { width: 2048, height: 2048 },
  back: { width: 2048, height: 2048 },
  side: { width: 2048, height: 2048 },
}

export const DEFAULT_CLOTHING_COLORS: ClothingColors = {
  body: '#191919',
  sleeveLeft: '#8C8C8E',
  sleeveRight: '#8C8C8E',
  collar: '#8C8C8E',
}

export class ClothingShapeUtil extends ShapeUtil<ClothingShapeProps> {
  type = 'clothing' as const

  defaultProps: Partial<ClothingShapeProps> = {
    width: 800,
    height: 800,
    rotation: 0,
    opacity: 1,
    clothingView: 'front',
    clothingColors: DEFAULT_CLOTHING_COLORS,
    logoAreas: [],
    logoContent: {},
  }

  minSize = { minWidth: 100, minHeight: 100 }

  render(shape: ClothingShapeProps, context: { isSelected: boolean }): React.ReactElement {
    return React.createElement(ClothingRenderer, { 
      shape, 
      isSelected: context.isSelected 
    })
  }
}

interface ClothingRendererProps {
  shape: ClothingShapeProps
  isSelected: boolean
}

function ClothingRenderer({ shape, isSelected }: ClothingRendererProps): React.ReactElement {
  const [svgContent, setSvgContent] = React.useState<string>('')

  const view = shape.clothingView || 'front'
  const colors = shape.clothingColors || DEFAULT_CLOTHING_COLORS
  const logoAreas = shape.logoAreas || []
  const activeLogoId = shape.activeLogoId
  const logoContent = shape.logoContent || {}

  const viewBox = SVG_VIEWBOX[view]
  const scaleX = shape.width / viewBox.width
  const scaleY = shape.height / viewBox.height
  const scale = Math.min(scaleX, scaleY)

  const svgOffsetX = (shape.width - viewBox.width * scale) / 2
  const svgOffsetY = (shape.height - viewBox.height * scale) / 2

  React.useEffect(() => {
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

        const tempDiv = document.createElement('div')
        tempDiv.appendChild(svgEl)
        setSvgContent(tempDiv.innerHTML)
      } catch (error) {
        console.error('Failed to load clothing SVG:', error)
      }
    }

    loadSVG()
  }, [view, colors])

  return React.createElement('div', {
    className: 'absolute inset-0 overflow-visible',
    style: {
      transform: `rotate(${shape.rotation}deg)`,
      transformOrigin: 'center center',
    },
  }, [
    React.createElement('div', {
      key: 'svg-container',
      className: 'absolute overflow-hidden',
      style: {
        left: svgOffsetX,
        top: svgOffsetY,
        width: viewBox.width * scale,
        height: viewBox.height * scale,
      },
    }, React.createElement('div', {
      className: 'absolute origin-top-left',
      style: {
        transform: `scale(${scale})`,
        width: viewBox.width,
        height: viewBox.height,
      },
      dangerouslySetInnerHTML: { __html: svgContent },
    })),
    ...logoAreas.map((logoArea) => {
      const logoImage = logoContent[logoArea.id]
      const showOverlay = isSelected && !activeLogoId
      const showImage = !!logoImage

      return React.createElement('div', {
        key: logoArea.id,
        className: 'absolute cursor-pointer transition-all duration-200 z-10',
        style: {
          left: svgOffsetX + logoArea.x * scale,
          top: svgOffsetY + logoArea.y * scale,
          width: logoArea.width * scale,
          height: logoArea.height * scale,
          border: showOverlay && !logoImage ? '1px solid #3B82F6' : 'none',
          backgroundColor: logoImage ? 'transparent' : showOverlay ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      }, [
        showImage && React.createElement('img', {
          key: 'img',
          src: logoImage,
          alt: '',
          className: 'absolute inset-0 w-full h-full',
          style: { objectFit: 'contain' },
        }),
        showOverlay && !logoImage && React.createElement('div', {
          key: 'label',
          className: 'absolute inset-0 flex items-center justify-center pointer-events-none',
        }, React.createElement('span', {
          className: 'text-[9px] text-blue-600 font-bold bg-white/95 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap',
        }, logoArea.id.replace('logo_', '').toUpperCase())),
      ])
    }),
  ])
}
