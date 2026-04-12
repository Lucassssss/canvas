'use client'

import React, { useRef, useEffect } from 'react'
import type { AlignmentGuide } from '../shapes/types'

const GUIDE_COLOR = '#fc2200ff'
const GUIDE_THICKNESS = 1

let guidesData: AlignmentGuide[] = []
let viewportData = { x: 0, y: 0, zoom: 1 }

export function updateGuidesData(guides: AlignmentGuide[], viewport: { x: number; y: number; zoom: number }) {
  guidesData = guides
  viewportData = viewport
}

export const AlignmentGuides: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number | null = null
    let lastGuidesLength = 0

    const renderGuides = () => {
      rafId = null

      if (guidesData.length === 0) {
        if (lastGuidesLength > 0) {
          container.innerHTML = ''
          lastGuidesLength = 0
        }
        return
      }

      const fragment = document.createDocumentFragment()

      for (let i = 0; i < guidesData.length; i++) {
        const guide = guidesData[i]
        const el = document.createElement('div')
        el.className = 'pointer-events-none absolute'
        el.style.backgroundColor = GUIDE_COLOR

        if (guide.type === 'vertical') {
          const screenX = guide.targetPosition * viewportData.zoom + viewportData.x
          const screenStart = guide.start * viewportData.zoom + viewportData.y
          const screenEnd = guide.end * viewportData.zoom + viewportData.y

          el.style.left = `${screenX}px`
          el.style.top = `${screenStart}px`
          el.style.width = `${GUIDE_THICKNESS}px`
          el.style.height = `${screenEnd - screenStart}px`
        } else {
          const screenY = guide.targetPosition * viewportData.zoom + viewportData.y
          const screenStart = guide.start * viewportData.zoom + viewportData.x
          const screenEnd = guide.end * viewportData.zoom + viewportData.x

          el.style.left = `${screenStart}px`
          el.style.top = `${screenY}px`
          el.style.width = `${screenEnd - screenStart}px`
          el.style.height = `${GUIDE_THICKNESS}px`
        }

        fragment.appendChild(el)
      }

      container.innerHTML = ''
      container.appendChild(fragment)
      lastGuidesLength = guidesData.length
    }

    const scheduleRender = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(renderGuides)
      }
    }

    const intervalId = setInterval(scheduleRender, 16)

    return () => {
      clearInterval(intervalId)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-50" />
  )
}
